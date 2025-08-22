import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { In, Repository } from 'typeorm';
import { LivraisonEntity } from './livraison.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { ColisEntity } from '../colis/colis.entity';
import { PointLivraisonEntity } from '../point-livraison/point-livraison.entity';
import { LivraisonCreateDto } from 'src/common/dto/livraison/create-livraison-dto';
import { Utils } from 'src/common/utils/utils';
import { plainToClass, plainToInstance } from 'class-transformer';
import { StatusLivraison } from 'src/common/enum/status-livraison.enum';
import { ProblemeLivraisonCreateDto } from 'src/common/dto/livraison/create-probleme-livraison-dto';
import { ProblemeLivraisonEntity } from './probleme-livraison.entity';
import { ColisCreateDto } from 'src/common/dto/colis/create-colis-dto';
import { StatusColis } from 'src/common/enum/status-colis.enum';
import { DetailColisDto } from 'src/common/dto/colis/detail-colis-dto';
import { BarcodeService } from 'src/core/code_barre/code_barre.service';
import { LivraisonUpdateDto } from 'src/common/dto/livraison/update-livraison-dto';

@Injectable()
export class LivraisonsService {
    constructor(
        private readonly barcodeService: BarcodeService,
        @InjectRepository(LivraisonEntity)
        private readonly livraisonRep: Repository<LivraisonEntity>,
        @InjectRepository(ColisEntity)
        private readonly colisRep: Repository<ColisEntity>,
        @InjectRepository(PointLivraisonEntity)
        private readonly plRep: Repository<PointLivraisonEntity>,
        @InjectRepository(ProblemeLivraisonEntity)
        private readonly problemeLivraisonRep: Repository<ProblemeLivraisonEntity>
    ){}

    async findDeliveryNotCompletedByIdPL(idPL: number): Promise<LivraisonEntity[]> {
        if(!idPL) throw new Error(`ID point de livraison invalid!`);

        return this.livraisonRep
            .createQueryBuilder("l")
            .innerJoinAndSelect("l.point_livraison", "pl")
            .innerJoinAndSelect("l.colis", "c")
            .where("pl.id =:id", { id: idPL })
            .andWhere("(l.status =:echec OR l.status =:retourne_expediteur OR l.status =:partielle)", {
                echec: StatusLivraison.ECHEC_LIVRAISON,
                retourne_expediteur: StatusLivraison.RETOUR_EXPEDITEUR,
                partielle: StatusLivraison.LIVRAISON_PARTIELLE,
            })
            .getMany();
        }
        
        async findByDateTourneeAndPointLivraison(idPL: number, dateTournee: string, heure_debut: string, heure_fin: string): Promise<LivraisonEntity[]> {
            return this.livraisonRep
            .createQueryBuilder("l")
            .innerJoinAndSelect("l.point_livraison", "pl")
            .innerJoinAndSelect("l.colis", "c")
            .where("pl.id = :id", { id: idPL })
            .andWhere("l.date_livraison = :date AND l.heure_fin BETWEEN CAST(:debut as time) AND CAST(:fin as time)", {
                date: dateTournee,
                debut: heure_debut,
                fin: heure_fin,
            })
            .andWhere("(l.status != :annule)", {
                annule: StatusLivraison.ANNULE
            })
            .getMany();
    }

    async findAll(): Promise<LivraisonEntity[]>{
        return this.livraisonRep.find({
            relations: ["point_livraison", "colis"]
        });
    }

    async findById(id: number): Promise<LivraisonEntity>{
        if(!id) throw new BadRequestException("ID invalide");
        
        const matched = await this.livraisonRep.findOne({
            where: {id: id},
            relations: ["point_livraison", "colis"]
        });

        if(!matched) throw new NotFoundException(`Livraison avec ID:{${id}} est introuvable!`);

        return matched;
    }

    async findManyByIds(ids: number[]): Promise<LivraisonEntity[]>{
        if(!ids) throw new BadRequestException("ID invalide");
        
        const matched = await this.livraisonRep.find({
            where: {id: In(ids)},
            relations: ["point_livraison", "colis"]
        });

        if(!matched) throw new NotFoundException(`Livraison avec ID:{${Object.values(ids)}} sont introuvable!`);

        return matched;
    }
    
    async save(dto: LivraisonCreateDto): Promise<LivraisonEntity>{
        if(!dto) throw new BadRequestException("Données invalides");

        const livraison = plainToInstance(LivraisonEntity, dto);
        const pl: PointLivraisonEntity|null = await this.plRep.findOne({where: {id: dto.id_point_livraison}});
        if(!pl) throw new NotFoundException(`Point de livraison avec ID:{${dto.id_point_livraison}} est introuvable!`);

        livraison.status = StatusLivraison.EN_ATTENTE;
        livraison.colis = this.getColis(dto.colis);
        livraison.point_livraison = pl;
        livraison.code_postal = pl.code_postal;
        livraison.pays = pl.pays;
        livraison.rue = pl.nom_rue + "-" + pl.numero_rue;
        livraison.ville = pl.ville;

        const queryRunner = this.livraisonRep.manager.connection.createQueryRunner();
        await queryRunner.connect();
        await queryRunner.startTransaction();

        try {
            const savedLivraison = await queryRunner.manager.save(LivraisonEntity, livraison);
            savedLivraison.colis = await this.batchGenerateCodeBarre(savedLivraison.colis);
            const updated = await queryRunner.manager.save(ColisEntity, savedLivraison.colis);
            await queryRunner.commitTransaction();

            savedLivraison.colis = updated;
            return savedLivraison;
        } catch (error) {
            await queryRunner.rollbackTransaction();
            throw error;
        } finally {
            await queryRunner.release();
        }
    }

    async update(id: number, dto: LivraisonUpdateDto): Promise<LivraisonEntity>{
        if(!dto || !id) throw new BadRequestException("Données invalides");
        
        const existing = await this.findById(id);
        const pl = await this.plRep.findOne({where: {id: dto.id_point_livraison}});
        if(!pl) throw new NotFoundException(`Point de livraison avec ID:{${dto.id_point_livraison}} est introuvable!`);

        existing.notes = dto.notes;
        existing.heure_debut = dto.heure_debut;
        existing.heure_fin = dto.heure_fin;
        existing.code_postal = pl.code_postal;
        existing.pays = pl.pays;
        existing.rue = pl.nom_rue + "-" + pl.numero_rue;
        existing.ville = pl.ville;
        existing.status = StatusLivraison.EN_ATTENTE;
        existing.point_livraison = pl;

        return this.livraisonRep.save(existing);
    }

    async updateStatut(id: number, statut: string){
        if(!statut || !id) throw new BadRequestException("Données invalides");
        const existing = await this.findById(id);
        const statuts = Object.values(StatusLivraison);
        const matched = statuts.filter((s) => s === statut)

        if(!matched || matched.length === 0) throw new BadRequestException(`Statut: {${statut}} inconnue! Voici les statuts acceptés: ${statuts}`);
        
        existing.status = statut;

        await this.livraisonRep.save(existing);
        return "Statut modifié avec succés!";
    }

    async signalProbleme(id: number, dto: ProblemeLivraisonCreateDto): Promise<ProblemeLivraisonEntity>{
        if(!dto || !id) throw new BadRequestException("Données invalides");
        const existing = await this.findById(id);

        const probleme:ProblemeLivraisonEntity = plainToInstance(ProblemeLivraisonEntity, dto);
        probleme.livraison = existing;
        const prepared = this.problemeLivraisonRep.create(probleme);

        return this.problemeLivraisonRep.save(prepared);
    }


    private getColis(dto: ColisCreateDto[]){
        if(! Array.isArray(dto)) throw new BadRequestException("Colis doit être un tableau");

        const colis: ColisEntity[] = plainToInstance(ColisEntity, dto);
        return colis.map(c => {
            c.status = StatusColis.EN_ATTENTE;
            c.poids_total = this.getSumWeight(c.details_colis);  
            
            return c;
        });
    } 

    private getSumWeight(detailsColis: DetailColisDto[]) {
        let sum = 0;
        if(!detailsColis || detailsColis.length === 0) return sum;

        detailsColis.forEach(d => {
            sum += d.poids;
        });

        return sum;
    }    

    private batchGenerateCodeBarre(colis: ColisEntity[]){
        return Promise.all(colis.map(async c => {
            c.code_barre = this.generateSequentialBarcode(c.id, "COLIS");
            c.code_barre_client = this.generateSequentialBarcode(c.id, "REF-CLIENT");
            return c;
        }));
    }

    private generateSequentialBarcode(id: number, prefix = 'PROD'): string {
        return `${prefix}-${id.toString().padStart(6, '0')}`;
    }
}
