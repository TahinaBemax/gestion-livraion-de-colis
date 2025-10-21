import { Injectable, Logger } from "@nestjs/common";
import { plainToInstance } from "class-transformer";
import { ContrainteLivraisonCsvDto } from "src/common/dto/csv-import/contrainte-livraison-csv-dto";
import { PointLivraisonCsvDto } from "src/common/dto/csv-import/point-livraison-csv-dto";
import { CsvParser, ParsedCsv } from "./parser/csv.parser";
import { Repository } from "typeorm";
import { InjectRepository } from "@nestjs/typeorm";
import { PointLivraisonEntity } from "../point-livraison/point-livraison.entity";
import { ContrainteLivraisonEntity } from "../contrainte-livraison/contrainte-livraison.entity";
import { ImportCsvResponseDto } from "src/common/dto/csv-import/import-csv-response-dto";
import { FileCleanUpHandlerService } from "src/common/file-clean-up-handler/file-clean-up-handler.service";



@Injectable()
export class CsvImportService {
  private readonly logger = new Logger(CsvImportService.name);
  constructor(
    @InjectRepository(PointLivraisonEntity)
    private readonly plRepo: Repository<PointLivraisonEntity>,
    @InjectRepository(ContrainteLivraisonEntity)
    private readonly contraintLivraisonRepo: Repository<ContrainteLivraisonEntity>,
    private readonly fileCleanupService: FileCleanUpHandlerService
  ) {}

  async importCsv(
    plPath: string,
    ckPath?: string | null
  ) {
    const filePaths = [plPath, ckPath];
    
    //points de livraison
    try {
      this.logger.log('Starting CSV import process');
      this.logFilesInfo(filePaths as (string | null)[]);

      var is_success:boolean = true;
      var message:string = "Importé avec succés!";

      //points de livraison
      const parsedPLs = await this.parse<PointLivraisonCsvDto>(plPath, PointLivraisonCsvDto);
      //contraintes de livraison
      const parsedCKs = ckPath ? await this.parse<ContrainteLivraisonCsvDto>(ckPath, ContrainteLivraisonCsvDto) : { success: [], errors: [] };

      if(this.hasErrors(parsedPLs, parsedCKs)){
          this.logger.warn('CSV import completed with errors');
          return this.csvImportResult(false, "Erreur de données", parsedPLs, parsedCKs);
      }
      
      //points de livraison
      var existings_points_livraison: PointLivraisonEntity[] = await this.plRepo.find();
      const points_livraison_from_csv = this.mapToPointLivraisonEntity(parsedPLs.success);

      const existingMagasins = new Set(existings_points_livraison.map(pl => pl.numero_magasin));
      const newPoints = points_livraison_from_csv.filter(pl => !existingMagasins.has(pl.numero_magasin));

      existings_points_livraison = existings_points_livraison.concat(newPoints);

      existings_points_livraison.forEach(pl => {
        const matchedConstrainte = this.prepareConstraintDeliveryInstance(parsedCKs.success, pl);
        if(matchedConstrainte.length > 0){
          this.assignConstraintToPL(pl, matchedConstrainte);
        }
      });

      //persist dans la base de données
      await this.save(existings_points_livraison);
      this.logger.log('CSV import completed successfully');

      return this.csvImportResult(is_success, message, parsedPLs, parsedCKs);
    } catch (error) {
      is_success = false;
      message = error;
      this.logger.error('CSV import failed:', error);
      throw error;
    } finally {
      // Clean up only CSV files
      await this.fileCleanupService.cleanupCsvFiles(filePaths as (string | null)[]);
      this.logger.log('CSV temporary files cleaned up');
    }
  }

  private mapToPointLivraisonEntity(liste: PointLivraisonCsvDto[]){
      return liste.map(pl => {
          const pointL = plainToInstance(PointLivraisonEntity, pl);
          pointL.numero_magasin = pl.nom_point_livraison;
          return pointL;
      });
  }

  private hasErrors
  (
    parsedPLs: ParsedCsv<PointLivraisonCsvDto>, 
    parsedCKs: ParsedCsv<ContrainteLivraisonCsvDto>
  )
  {
      return (parsedPLs.errors.length > 0 || parsedCKs.errors.length > 0);
  }

  private async save(pls: PointLivraisonEntity[]){
    const queryRunner = this.plRepo.manager.connection.createQueryRunner();

    //start a transaction
    await queryRunner.startTransaction();
    try {
      await queryRunner.manager.save(PointLivraisonEntity, pls);
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
    parsedCKs: ParsedCsv<ContrainteLivraisonCsvDto>
  ){
    const result: ImportCsvResponseDto = {
      is_success,
      errors: {
        points_livraison: parsedPLs.errors,
        contraintes_livraison: parsedCKs.errors
      },
      success_rows: {
        points_livraison: parsedPLs.success,
        contraintes_livraison: parsedCKs.success
      },
      message
    };

    return result;
  }

  private prepareConstraintDeliveryInstance(fromCsv: ContrainteLivraisonCsvDto[], pl:PointLivraisonEntity){
    const matchedConstrainte = fromCsv.filter(ck => ck.nom_point_livraison === pl.numero_magasin);
    return matchedConstrainte.map(c => {
      return plainToInstance(ContrainteLivraisonEntity, c);
    });    
  }
  
  private concatExistingAndNewConstraintDelivery(existings: ContrainteLivraisonEntity[], fromCsv: ContrainteLivraisonEntity[]){
      const news: ContrainteLivraisonEntity[] = [];
      for (const csv of fromCsv) {
        let isExist = false;
        for (const existing of existings) {
            if(csv.intitule_contrainte === existing.intitule_contrainte && csv.point_livraison?.numero_magasin === existing.point_livraison?.numero_magasin){
                isExist = true;
                break;
            }
        }

        if(!isExist){
          news.push(csv)
        }
      }

      return existings.concat(news);
  }

  private async assignConstraintToPL(
    pl: PointLivraisonEntity,
    constraints: ContrainteLivraisonEntity[]
  ) 
  {
    const existingConstraints: ContrainteLivraisonEntity[] = await this.contraintLivraisonRepo
      .createQueryBuilder("contrainte")
      .innerJoinAndSelect("contrainte.point_livraison", 'pl')
      .where("pl.id = :id", {id: pl.id})
      .getMany();

    const allConstraints = this.concatExistingAndNewConstraintDelivery(existingConstraints, constraints);

    (pl.id && pl.contraintes_livraison && pl.contraintes_livraison.length > 0) ? pl.contraintes_livraison = pl.contraintes_livraison.concat(allConstraints)
      : pl.contraintes_livraison = allConstraints;
  }

  private logFilesInfo(filePaths: (string | null)[]): void {
    const validPaths = filePaths.filter(path => path !== null) as string[];
    validPaths.forEach(filePath => {
      const size = this.fileCleanupService.getFileSize(filePath);
      this.logger.log(`Processing file: ${filePath} (${size})`);
    });
  }

}
