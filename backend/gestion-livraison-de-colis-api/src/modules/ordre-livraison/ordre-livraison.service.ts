import { TourneePointLivraisonDto } from './../../common/dto/tournee-livraison/create-tournee-point-livraison-dto';
import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { OrdreLivraisonEntity } from './ordre-livraison.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { OrdreLivraisonCreateDto } from 'src/common/dto/ordre-livraison/ordre-livraison-dto';
import { LivraisonEntity } from '../livraisons/livraison.entity';
import { LivraisonsService } from '../livraisons/livraisons.service';
import { Repository, QueryRunner, DataSource } from 'typeorm';
import { OrdreLivraisonUpdateDto } from 'src/common/dto/ordre-livraison/update-ordre-livraison-dto';
import { TourneeLivraisonEntity } from '../tournee-livraison/tournee-livraison.entity';
import { PointLivraisonEntity } from '../point-livraison/point-livraison.entity';
import { StatutTourneeLivaison } from 'src/common/enum/status-tournee-livraison';
import { ColisEntity } from '../colis/colis.entity';
import { StatusColis } from 'src/common/enum/status-colis.enum';
import { StatusLivraison } from 'src/common/enum/status-livraison.enum';


@Injectable()
export class OrdreLivraisonService {
    constructor(
        @InjectRepository(OrdreLivraisonEntity)
        private readonly ordreRepo: Repository<OrdreLivraisonEntity>,
        @InjectRepository(TourneeLivraisonEntity)
        private readonly tourneeRepo: Repository<TourneeLivraisonEntity>,
        @InjectRepository(PointLivraisonEntity)
        private readonly plRepo: Repository<PointLivraisonEntity>,
        private readonly livraisonService: LivraisonsService,
        @InjectRepository(ColisEntity)
        private readonly colisRep: Repository<ColisEntity>,
    ){}

    async findAll(): Promise<OrdreLivraisonEntity[]> {
        return this.ordreRepo.find({relations: ["livraisons", "points_livraison"] });
    }

    async findAllByIdPL(id: number): Promise<OrdreLivraisonEntity[]> {
        return this.ordreRepo.createQueryBuilder("o")
            .innerJoinAndSelect("o.point_livraison", "pl")
            .where("pl.id = :id", {id: id})
            .getMany();
    }

    async findAllByTournee(id: number): Promise<OrdreLivraisonEntity[]> {
        return this.ordreRepo.createQueryBuilder("o")
            .innerJoinAndSelect("o.tournee_livraison", "tournee")
            .where("tournee.id = :id", {id: id})
            .getMany();
    }
    
    async findById(id: number): Promise<OrdreLivraisonEntity> {
        const mathced = await this.ordreRepo.findOne({
            where: {id: id},
            relations: ["livraisons"] 
        });

        if(!mathced) throw new NotFoundException(`Tournée Livraison avec ID:{${id}} est introuvable!`);

        return mathced;
    }

    async save(dto: OrdreLivraisonCreateDto){
        if(!dto) throw new BadRequestException("Données ordre de livraison invalides");

        const ordre_livraison = await this.getOrdreLivraison(dto);

        const prepared = this.ordreRepo.create(ordre_livraison);
        return this.ordreRepo.save(prepared);
    }
    
    async batchSave(dto: OrdreLivraisonCreateDto[]) {
        const dataSource = this.ordreRepo.manager.connection as DataSource;
        const queryRunner = dataSource.createQueryRunner();
        await queryRunner.connect();
        await queryRunner.startTransaction();

        try {
            // 1. Update colis status for all incomplete livraisons
            for (const data of dto) {
                await this.filterColisAndHandleStatus(data.incompletedLivraisons, queryRunner);
            }

            // 2. Prepare and save ordre de livraison entities
            const ordres_livraison: OrdreLivraisonEntity[] = [];
            for (const data of dto) {
                const ordre = await this.getOrdreLivraison(data);

                //save status of colis and livraison
                await queryRunner.manager.save(LivraisonEntity, ordre.livraisons);
                ordres_livraison.push(ordre);
            }

            const prepared = queryRunner.manager.create(OrdreLivraisonEntity, ordres_livraison);
            const saved = await queryRunner.manager.save(OrdreLivraisonEntity, prepared);

            await queryRunner.commitTransaction();
            return saved;
        } catch (error) {
            await queryRunner.rollbackTransaction();
            throw error;
        } finally {
            await queryRunner.release();
        }
    }

    async update(id: number, dto: OrdreLivraisonUpdateDto){
        if(!dto || !id) throw new BadRequestException("Données planning livraison invalides");
        const existing = await this.findById(id);
        this.checkStatutTourneeLivraison(existing.tournee_livraison);

        const livraisons = await this.livraisonService.findManyByIds(dto.id_livraisons);
        if(!livraisons) throw new BadRequestException(`Livraisons avec ID:{${dto.id_livraisons}} est introuvable!`);

        existing.point_obtenu = dto.point_obtenu;
        existing.estimation_retard = dto.estimation_retard;
        existing.nbr_colis_prevu = this.getNbrColisPrevu(livraisons);
        existing.nbr_colis_reel = dto.nbr_colis_reel;
        existing.livraisons = livraisons;

        return this.ordreRepo.save(existing);
    }

    async delete(id: number) {
        if(!id) throw new BadRequestException("Id tournée de livraison invalide");
        const existing = await this.findById(id);
        return this.ordreRepo.delete(existing.id);
    }  

    async deleteAllByTourneeAndPointLivraison(idTournee: number, idPL: number) {
        if(!idTournee || idPL) throw new BadRequestException("Id tournée de livraison invalide");
        const existing = await this.ordreRepo.createQueryBuilder("ordre")
            .innerJoinAndSelect("ordre.tournee_livraison", "t")
            .innerJoinAndSelect("ordre.point_livraison", "pl")
            .where("t.id =: id AND pl.id = :idPL", {id: idTournee, idPL: idPL})
            .getMany();
        
        for (const ordre of existing) {
            await this.ordreRepo.delete(ordre.id);
        }
    } 

    private getNbrColisPrevu(livraisons: LivraisonEntity[]): number{
        let total = 0;
        livraisons.forEach((l: LivraisonEntity) => {
            total += l.colis.length;
        });

        return total;
    }

    private getNbrColisReel(dto: OrdreLivraisonCreateDto): number{
        let total_prevu = this.getNbrColisPrevu(dto.livraisons);
        
        dto.incompletedLivraisons.forEach(l => {
            total_prevu += l.colis.length;
        });
        
        return total_prevu;
    }

    async mapToOrdreLivraisonCreateDTo(idTournee: number, dto: TourneePointLivraisonDto): Promise<OrdreLivraisonCreateDto[]>{
        if(!idTournee || !dto) throw new BadRequestException("Données invalides");

        const existingTournee:TourneeLivraisonEntity|null = await this.tourneeRepo.findOneBy({id: idTournee});
        if(!existingTournee) throw new NotFoundException(`Tournée de livraison avec ID:{${idTournee}} introuvable`);
        this.checkStatutTourneeLivraison(existingTournee);

        
        return Promise.all(dto.id_points_livraison.map(async (idPL) => {
            const ordre_livraison = new OrdreLivraisonCreateDto();
            const pl = await this.plRepo.findOneBy({id: idPL});
            if(!pl) throw new NotFoundException(`Point de livraison avec ID:{${idPL}} introuvable!`);

            const incompleteLivraisons:LivraisonEntity[] = await this.livraisonService.findDeliveryNotCompletedByIdPL(idPL);
            const matchedLivraisons:LivraisonEntity[] = await this.livraisonService.findByDateTourneeAndPointLivraison(idPL, existingTournee.date_tournee, existingTournee.heure_debut, existingTournee.heure_fin);

            ordre_livraison.tournee = existingTournee;
            ordre_livraison.pointLivraion = pl;
            ordre_livraison.livraisons = matchedLivraisons;
            ordre_livraison.incompletedLivraisons = incompleteLivraisons;

            return ordre_livraison;
        }));
    }

    private async filterColisAndHandleStatus(
        incompleteLivraisons: LivraisonEntity[],
        queryRunner?: QueryRunner
    ): Promise<void> {
        if (incompleteLivraisons.length > 0) {
            for (const l of incompleteLivraisons) {
                const reliquats = l.colis.filter(c => c.status !== StatusColis.LIVRE);
                if (reliquats.length > 0) {
                    const updatedColis = reliquats.map((colis) => {
                        colis.status = StatusColis.RELIQUAT;
                        return colis;
                    });
                    if (queryRunner) {
                        await queryRunner.manager.save(ColisEntity, updatedColis);
                    } else {
                        await this.colisRep.save(updatedColis);
                    }
                }
            }
        }
    }

    private async getOrdreLivraison(dto: OrdreLivraisonCreateDto){
        const ordre_livraison = new OrdreLivraisonEntity();
        ordre_livraison.point_obtenu = 0;
        ordre_livraison.estimation_retard = "00:00:00";
        ordre_livraison.nbr_colis_prevu = this.getNbrColisPrevu(dto.livraisons);
        ordre_livraison.nbr_colis_reel = this.getNbrColisReel(dto);
        ordre_livraison.tournee_livraison = dto.tournee;
        ordre_livraison.livraisons = dto.incompletedLivraisons.concat(dto.livraisons);
        ordre_livraison.point_livraison = dto.pointLivraion;

        for (const livraison of ordre_livraison.livraisons) {
            livraison.status = StatusLivraison.DISTRIBUEUR_ASSIGNÉ;
            livraison.colis.forEach(c => {
                if(c.status !== StatusColis.RELIQUAT){
                    c.status = StatusColis.A_CHARGE_DANS_LA_CAMION
                }
            });
        }

        return ordre_livraison;
    }

    private checkStatutTourneeLivraison(tournee: TourneeLivraisonEntity){
        if(tournee.statut !== StatutTourneeLivaison.BROUILLON && tournee.statut !== StatutTourneeLivaison.PLANIFIE){
            throw new BadRequestException(`Impossible de planifier un ordre de livraison pour un tournée avec statut:${tournee.statut}`);
        }

        return true;
    }
}
