import { TourneePointLivraisonDto } from './../../common/dto/tournee-livraison/create-tournee-point-livraison-dto';
import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { OrdreLivraisonEntity } from './ordre-livraison.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { OrdreLivraisonCreateDto } from 'src/common/dto/ordre-livraison/ordre-livraison-dto';
import { LivraisonEntity } from '../livraisons/livraison.entity';
import { LivraisonsService } from '../livraisons/livraisons.service';
import { Repository, QueryRunner, DataSource, In } from 'typeorm';
import { OrdreLivraisonUpdateDto } from 'src/common/dto/ordre-livraison/update-ordre-livraison-dto';
import { TourneeLivraisonEntity } from '../tournee-livraison/tournee-livraison.entity';
import { PointLivraisonEntity } from '../point-livraison/point-livraison.entity';
import { StatutTourneeLivaison } from 'src/common/enum/status-tournee-livraison';
import { ColisEntity } from '../colis/colis.entity';
import { StatusColis } from 'src/common/enum/status-colis.enum';
import { StatusLivraison } from 'src/common/enum/status-livraison.enum';
import { StatutOrdreLivraison } from 'src/common/enum/statut-ordre-livraison.enum';
import { FicheOrdreLivraisonDto } from 'src/common/dto/ordre-livraison/fiche-ordre-livraison-dto';
import { ColisService } from '../colis/colis.service';
import { NotificationService } from '../notification/notification.service';
import { BordereauLivraisonEntity } from '../bordereau-livraison/bordereau-livraison.entity';


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
        private readonly colisService: ColisService,
        private readonly notificationService: NotificationService,
    ){}

    async findAll(): Promise<OrdreLivraisonEntity[]> {
        return this.ordreRepo.find({relations: ["livraisons", "tournee_livraison", "point_livraison"] });
    }

    async findByStatut(statut?: string): Promise<OrdreLivraisonEntity[]> {
        if(statut){
            return this.ordreRepo.find(
                {
                    where: {statut: statut},
                    relations: ["livraisons", "point_livraison", "tournee_livraison"] 
                }
            );
        }

        return this.ordreRepo.find({
            where: {statut: In([StatutOrdreLivraison.EN_COURS, StatutOrdreLivraison.EFFECTUE])},
            relations: ["livraisons", "point_livraison", "tournee_livraison"]
        });
    }

    async findAllByIdPL(id: number): Promise<OrdreLivraisonEntity[]> {
        return this.ordreRepo.createQueryBuilder("o")
            .innerJoinAndSelect("o.tournee_livraison", "tournee")
            .innerJoinAndSelect("o.livraisons", "l")
            .innerJoinAndSelect("o.point_livraison", "pl")
            .where("pl.id = :id", {id: id})
            .getMany();
    }

    async findAllByTournee(id: number): Promise<OrdreLivraisonEntity[]> {
        return this.ordreRepo.createQueryBuilder("o")
            .innerJoinAndSelect("o.tournee_livraison", "tournee")
            .innerJoinAndSelect("o.livraisons", "l")
            .innerJoinAndSelect("o.point_livraison", "pl")
            .where("tournee.id = :id", {id: id})
            .getMany();
    }
    
    /**
     * LISTE DES ORDRE DE LIVRAISON FILTRE PAR Prestataire, Client, Date, ZoneGeographique(Code Postal) 
     * @param statuts 
     * @returns 
     */
    async findByPrestataire(idPrestataire: number): Promise<OrdreLivraisonEntity[]>{
        const query = this.ordreRepo.createQueryBuilder("ol")
        .leftJoinAndSelect("ol.point_livraison", "pl")
        .innerJoin("pl.prestataire", "p")
        .innerJoin("ol.tournee_livraison", "tournee")
        .innerJoinAndSelect("o.livraisons", "l")
        //.leftJoinAndSelect("ol.client", "c")
        
        if(idPrestataire) query.andWhere("p.id_prestataire = :idPrestataire", {idPrestataire: idPrestataire});

        //if(idClient) query.andWhere("c.id = :idClient", {idClient: parseInt(idClient)});

        return query.getMany();
    }
    /**
     * LISTE DES ORDRE DE LIVRAISON FILTRE PAR Prestataire, Client, Date, ZoneGeographique(Code Postal) 
     * @param statuts 
     * @returns 
     */
    async filterBy(idPrestataire?: string, idClient?: string, date?: string, zoneGeographique?: string): Promise<OrdreLivraisonEntity[]>{
        const query = this.ordreRepo.createQueryBuilder("ol")
            .innerJoinAndSelect("ol.point_livraison", "pl")
            .innerJoinAndSelect("ol.tournee_livraison", "tournee")
            .innerJoinAndSelect("tournee.prestataire", "p")
            .innerJoinAndSelect("ol.livraisons", "livraison")
            .innerJoinAndSelect("livraison.client", "client")
        
        if(date) query.where("tournee.date_tournee = :date", {date: date});
        
        if(zoneGeographique) query.andWhere("pl.code_postal = :code OR pl.ville = :ville", {code: zoneGeographique, ville: zoneGeographique});

        if(idPrestataire) query.andWhere("p.id_prestataire = :idPrestataire", {idPrestataire: parseInt(idPrestataire)});

        if(idClient) query.andWhere("client.id = :idClient", {idClient: parseInt(idClient)});

        return query.getMany();
    }

    async findById(id: number): Promise<OrdreLivraisonEntity> {
        const matched = await this.ordreRepo.findOne({
            where: {id: id},
            relations: ["livraisons", "tournee_livraison", "point_livraison"] 
        });

        if(!matched) throw new NotFoundException(`Tournée Livraison avec ID:{${id}} est introuvable!`);

        return matched;
    }

    /**
     * GENERATION D'UNE FICHE DE LIVRAISON PAR ID ORDRE DE LIVRAISON
     * @param id ID Ordre de livraison
     * @returns Fiche ordre de livraison
     */
    async getFicheOrdreLivraison(id: number): Promise<FicheOrdreLivraisonDto> {
        const matched = await this.ordreRepo.findOne({
            where: {id: id},
            relations: ["livraisons", "tournee_livraison"] 
        });

        if(!matched) throw new NotFoundException(`Tournée Livraison avec ID:{${id}} est introuvable!`);
        const tournee = await matched.tournee_livraison;
        const bordereau: BordereauLivraisonEntity = await matched.bordereau_livraison;

        if(!bordereau) throw new BadRequestException("Aucun bordereau de livraison n'a été trouvé pour cet ordre de livraison");
        const fiche = new FicheOrdreLivraisonDto();

        fiche.livraisons = matched.livraisons;
        fiche.point_livraison = matched.point_livraison;
        fiche.nbr_colis_prevu = matched.nbr_colis_prevu;
        fiche.nbr_colis_reel = matched.nbr_colis_reel;
        fiche.statut = matched.statut;
        fiche.notifications = await this.notificationService.findByLivreurAndTournee(tournee.livreur.id_livreur, tournee.date_tournee, tournee.heure_debut, tournee.heure_fin);
        fiche.date_scan_bordereau = bordereau.date_scan_bordereau;
        fiche.date_scan_dernier_colis = await this.colisService.getDateLastColisDechargmentForTournee(tournee.id);
        fiche.date_scan_premier_colis = await this.colisService.getDateFirstColisLoadedForTournee(tournee.id);
        fiche.date_scan_PoD = "";

        return fiche;
    }

    async save(dto: OrdreLivraisonCreateDto){
        if(!dto) throw new BadRequestException("Données ordre de livraison invalides");

        const ordre_livraison = await this.getOrdreLivraison(dto);
        ordre_livraison.statut = StatutOrdreLivraison.EN_ATTENTE;

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
                ordre.statut = StatutOrdreLivraison.EN_ATTENTE;

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
        this.checkStatutTourneeLivraison((await existing.tournee_livraison));

        existing.point_obtenu = dto.point_obtenu?? existing.point_obtenu;
        existing.estimation_retard = dto.estimation_retard?? existing.estimation_retard;
        existing.nbr_colis_reel = dto.nbr_colis_reel?? existing.nbr_colis_reel;
        existing.statut = dto.statut?? existing.statut;

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

    async mapToOrdreLivraisonCreateDTo(idTournee: number, dto: number[]): Promise<OrdreLivraisonCreateDto[]>{
        if(!idTournee || !dto) throw new BadRequestException("Données invalides");

        const existingTournee:TourneeLivraisonEntity|null = await this.tourneeRepo.findOneBy({id: idTournee});
        if(!existingTournee) throw new NotFoundException(`Tournée de livraison avec ID:{${idTournee}} introuvable`);
        this.checkStatutTourneeLivraison(existingTournee);

        
        return Promise.all(dto.map(async (idPL) => {
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
                const reliquats = l.colis.filter(c => c.statut_colis !== StatusColis.LIVRE);
                
                if (reliquats.length > 0) {
                    const updatedColis = reliquats.map((colis) => {
                        colis.statut_colis = StatusColis.RELIQUAT;
                        return colis;
                    });

                    if (queryRunner) {
                        await queryRunner.manager.save(ColisEntity, updatedColis);
                    } else {
                        await this.colisService.batachUpdateColisEntity(updatedColis);
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
            livraison.statut_livraison = StatusLivraison.DISTRIBUEUR_ASSIGNÉ;
            livraison.colis.forEach(c => {
                if(c.statut_colis !== StatusColis.RELIQUAT){
                    c.statut_colis = StatusColis.A_CHARGE_DANS_LA_CAMION
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
