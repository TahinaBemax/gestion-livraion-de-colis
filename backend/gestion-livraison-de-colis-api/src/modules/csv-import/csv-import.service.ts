import { Injectable } from "@nestjs/common";
import { plainToInstance } from "class-transformer";
import { ContrainteJourLivraisonCsvDto } from "src/common/dto/csv-import/contrainte-jour-livraison-csv-dto";
import { ContrainteLivraisonCsvDto } from "src/common/dto/csv-import/contrainte-livraison-csv-dto";
import { PointLivraisonCsvDto } from "src/common/dto/csv-import/point-livraison-csv-dto";
import { ContrainteJourLivraison } from "../point-livraison/contrainte-jour-livraison/contrainte-jour-livraison.entity";
import { ContrainteLivraison } from "../point-livraison/contrainte-livraison/contrainte-livraison.entity";
import { PointLivraison } from "../point-livraison/point-livraison.entity";
import { CsvParser, ParsedCsv } from "./parser/csv.parser";
import { Repository } from "typeorm";
import { InjectRepository } from "@nestjs/typeorm";

export interface ImportCsvRestult {
  is_success: boolean;
  errors: {
    points_livraison: any[],
    contraintes_livraison: any[],
    contraintes_jour_livraison: any[]
  };
  success_rows: {
    points_livraison: PointLivraisonCsvDto[],
    contraintes_livraison: ContrainteLivraisonCsvDto[],
    contraintes_jour_livraison: ContrainteJourLivraisonCsvDto[]
  };
  message: string;
}

@Injectable()
export class CsvImportService {
  constructor(
    @InjectRepository(PointLivraison)
    private readonly plRepo: Repository<PointLivraison>
  ) {}

  async importCsv(
    plPath: string,
    ckPath?: string | null,
    ckDailyPath?: string | null,
  ) {
    var is_success = true;
    var message = "Importé avec succés!";
    //points de livraison
    const parsedPLs = await this.parse<PointLivraisonCsvDto>(plPath, PointLivraisonCsvDto);
    //contraintes de livraison
    const parsedCKs = ckPath ? await this.parse<ContrainteLivraisonCsvDto>(ckPath, ContrainteLivraisonCsvDto) : { success: [], errors: [] };
    //contraintes jour livraison
    const parsedDailyCKs = ckDailyPath ? await this.parse<ContrainteJourLivraisonCsvDto>(ckDailyPath, ContrainteJourLivraisonCsvDto) : { success: [], errors: [] };

    if(this.hasErrors(parsedPLs, parsedCKs, parsedDailyCKs)){
        return this.csvImportResult(false, "Erreur de données", parsedPLs, parsedCKs, parsedDailyCKs);
    }

    //points de livraison
    const points = plainToInstance(PointLivraison, parsedPLs.success);

    try {
      points.forEach(pl =>
        this.assignConstraintToPL(pl, parsedCKs.success, parsedDailyCKs.success),
      );

      //persist dans la base de données
      await this.save(points);
    } catch (error) {
      is_success = false;
      message = error;
      throw error;
    }

    return this.csvImportResult(is_success, message, parsedPLs, parsedCKs, parsedDailyCKs);
  }

  private hasErrors
  (
    parsedPLs: ParsedCsv<PointLivraisonCsvDto>, 
    parsedCKs: ParsedCsv<ContrainteLivraisonCsvDto>, 
    parsedDailyCKs: ParsedCsv<ContrainteJourLivraisonCsvDto>
  )
  {
      return (parsedPLs.errors.length > 0 || parsedCKs.errors.length > 0 || parsedDailyCKs.errors.length > 0);
  }

  private async save(pls: PointLivraison[]){
    const queryRunner = this.plRepo.manager.connection.createQueryRunner();

    //start a transaction
    await queryRunner.startTransaction();
    try {
      await queryRunner.manager.save(PointLivraison, pls);
      await queryRunner.commitTransaction();

      return true;
    } catch (error) {
        await queryRunner.rollbackTransaction();
        throw error;
    } finally {
        await queryRunner.release();
    }    
  }

  private async parse<T extends object>(filePath: string, dto: new () => T) {
    return CsvParser.parseFromCsvToInstance<T>(filePath, dto);
  }

  private csvImportResult(
    is_success:boolean,
    message:string,
    parsedPLs: ParsedCsv<PointLivraisonCsvDto>,
    parsedCKs: ParsedCsv<ContrainteLivraisonCsvDto>,
    parsedDailyCKs: ParsedCsv<ContrainteJourLivraisonCsvDto>): ImportCsvRestult
  {
    const result: ImportCsvRestult = {
      is_success,
      errors: {
        points_livraison: parsedPLs.errors,
        contraintes_livraison: parsedCKs.errors,
        contraintes_jour_livraison: parsedDailyCKs.errors
      },
      success_rows: {
        points_livraison: parsedPLs.success,
        contraintes_livraison: parsedCKs.success,
        contraintes_jour_livraison: parsedDailyCKs.success
      },
      message
    };

    return result;
  }

  private assignConstraintToPL(
    pl: PointLivraison,
    constraints: ContrainteLivraisonCsvDto[],
    dailyConstraints: ContrainteJourLivraisonCsvDto[],
  ) 
  {
    const relevantConstraints = constraints
      .filter(c => c.numero_magasin === pl.numero_magasin)
      .map(c => {
        const ck = plainToInstance(ContrainteLivraison, c);
        ck.date_debut = new Date(ck.date_debut);
        ck.date_fin = new Date(ck.date_fin);
        
        ck.contrainte_jour_livraisons = dailyConstraints
          .filter(dc => dc.intitule_contrainte === c.intitule_contrainte)
          .map(dc => plainToInstance(ContrainteJourLivraison, dc));
        return ck;
      });

    pl.contraintes_livraison = relevantConstraints;
  }


}
