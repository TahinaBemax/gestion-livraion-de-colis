import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { In, Repository } from 'typeorm';
import { LivraisonEntity } from './livraison.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { ColisEntity } from '../colis/colis.entity';
import { LivraisonCreateDto } from 'src/common/dto/livraison/create-livraison-dto';
import { StatusLivraison } from 'src/common/enum/status-livraison.enum';
import { ProblemeLivraisonCreateDto } from 'src/common/dto/livraison/create-probleme-livraison-dto';
import { ProblemeLivraisonEntity } from './probleme-livraison.entity';
import { StatusColis } from 'src/common/enum/status-colis.enum';
import { LivraisonUpdateDto } from 'src/common/dto/livraison/update-livraison-dto';
import { plainToInstance } from 'class-transformer';
import { DetailColisEntity } from '../colis/detail-colis.entity';
import { PointLivraisonService } from '../point-livraison/point-livraison.service';
import { DetailColisDto } from 'src/common/dto/colis/detail-colis-dto';
import { PointLivraisonEntity } from '../point-livraison/point-livraison.entity';
import { Utils } from 'src/common/utils/utils';
import { ClientService } from '../client/client.service';

@Injectable()
export class LivraisonsService {
    constructor(
        @InjectRepository(LivraisonEntity)
        private readonly livraisonRep: Repository<LivraisonEntity>,
        private readonly pointLivraisonService: PointLivraisonService,
        @InjectRepository(ProblemeLivraisonEntity)
        private readonly problemeLivraisonRep: Repository<ProblemeLivraisonEntity>,
        private readonly clientService: ClientService
    ){}


    /**
     * LISTE DES LIVRAISONS EN ATTENTE DE TRAITEMENT
     * @returns Liste des livraisons en attente de traitement
     */
    async findPendingDeliveries(): Promise<LivraisonEntity[]>{
        const groupedByPL: LivraisonEntity[] = [];
        const pointsLivraison: PointLivraisonEntity[] = await this.pointLivraisonService.findAll();

        const livraisons = await this.livraisonRep.createQueryBuilder("livraison")
        .leftJoinAndSelect("livraison.client", "client")
        .leftJoinAndSelect("livraison.colis", "colis")
        .leftJoinAndSelect("client.point_livraison", "pl")
        .where("livraison.statut_livraison = :statut OR livraison.statut_livraison = :retourExpediteur", {
            statut: StatusLivraison.EN_ATTENTE, 
            retourExpediteur: StatusLivraison.RETOUR_EXPEDITEUR
        })
        .orderBy("livraison.date_livraison", "DESC")
        .orderBy("livraison.heure_debut", "ASC")
        .getMany();

        for(const pl of pointsLivraison){
            for(const livraison of livraisons){
                const clientPL = livraison.client.point_livraison;
                if( clientPL && clientPL.id === pl.id){
                    groupedByPL.push(livraison);
                }
            }
        }

        return groupedByPL;
    }


    /**
     * LES LIVRAISON TERMINEES ET EN COURS DE TRAITEMENT 
     * @param statuts 
     * @returns 
     */
    async findByStatuts(statuts: StatusLivraison[]): Promise<LivraisonEntity[]>{
        if(statuts.length === 0) throw new BadRequestException("Liste des statuts est vide");

        return await this.livraisonRep.find({
            where: {statut_livraison: In(statuts)},
            relations: ["client", "colis"]
        });
    }


    /**
     * LES LIVRAISON TERMINEES ET EN COURS DE TRAITEMENT 
     * @param statuts 
     * @returns 
     */
    async filterBy(idPrestataire?: string, idClient?: string, date?: string, zoneGeographique?: string): Promise<LivraisonEntity[]>{
        const query = this.livraisonRep.createQueryBuilder("l")
            .innerJoinAndSelect("l.client", "c")
            .leftJoinAndSelect("c.point_livraison", "pl")
            .leftJoinAndSelect("pl.prestataire", "p")
        
        if(date) query.where("l.date_livraison = :date", {date: date});
        
        if(zoneGeographique) query.andWhere("l.code_postal = :code OR l.ville = :ville", {code: zoneGeographique, ville: zoneGeographique});

        if(idPrestataire) query.andWhere("p.id_prestataire = :idPrestataire", {idPrestataire: parseInt(idPrestataire)});

        if(idClient) query.andWhere("c.id = :idClient", {idClient: parseInt(idClient)});

        query.orderBy("l.date_livraison", "DESC");
        return query.getMany();
    }

    /**
     * 
     * @param idPL 
     * @returns 
     */
    async findDeliveryNotCompletedByIdPL(idPL: number): Promise<LivraisonEntity[]> {
        if(!idPL) throw new Error(`ID point de livraison invalid!`);

        return this.livraisonRep
            .createQueryBuilder("l")
            .innerJoinAndSelect("l.client", "client")
            .innerJoinAndSelect("client.point_livraison", "pl")
            .innerJoinAndSelect("l.colis", "c")
            .where("pl.id =:id", { id: idPL })
            .andWhere("(l.statut_livraison =:statut)", {
                statut: StatusLivraison.EN_ATTENTE,
            })
            .getMany();
    }

    /**
     * 
     * @param idClient 
     * @returns 
     */
    async findLivraisonIncompleteByIdClient(idClient:number): Promise<LivraisonEntity[]> {
        if(!idClient) throw new Error(`ID point de livraison invalid!`);

        return this.livraisonRep
            .createQueryBuilder("l")
            .innerJoinAndSelect("l.client", "client")
            .innerJoinAndSelect("client.point_livraison", "pl")
            .innerJoinAndSelect("l.colis", "c")
            .where("client.id =:idClient", { idClient: idClient })
            .andWhere("(l.statut_livraison =:echec OR l.statut_livraison =:retourne_expediteur OR l.statut_livraison =:partielle)", {
                echec: StatusLivraison.ECHEC_LIVRAISON,
                retourne_expediteur: StatusLivraison.RETOUR_EXPEDITEUR,
                partielle: StatusLivraison.LIVRAISON_PARTIELLE
            })
            .orderBy("l.date_livraison", "DESC")
            .getMany();
    }
    /**
     * 
     * @param idLivreur 
     * @param idLivraison 
     * @returns 
     */
    async estLivreurDuLivraison(idLivreur:number, idLivraison:number): Promise<boolean> {
        if(!idLivreur || !idLivraison) throw new Error(`ID Livreur ou ID Livraison invalide!`);

        const count = await this.livraisonRep
            .createQueryBuilder("l")
            .leftJoinAndSelect("l.ordre_livraison", "ordre")
            .leftJoinAndSelect("ordre.tournee_livraison", "tournee")
            .leftJoinAndSelect("tournee.livreur", "livreur")
            .where("livreur.id =:idLivreur", { idLivreur: idLivreur })
            .andWhere("l.id =:idLivraison", { idLivraison: idLivraison })
            .getCount();

        return count > 0;
    }
        
    async findByDateTourneeAndPointLivraison(idPL: number, dateTournee: string, heure_debut: string, heure_fin: string): Promise<LivraisonEntity[]> {
        return this.livraisonRep
            .createQueryBuilder("l")
            .innerJoinAndSelect("l.client", "client")
            .innerJoinAndSelect("client.point_livraison", "pl")
            .innerJoinAndSelect("l.colis", "c")
            .where("pl.id = :id", { id: idPL })
            .andWhere("l.date_livraison = :date AND l.heure_fin BETWEEN CAST(:debut as time) AND CAST(:fin as time)", {
                date: dateTournee,
                debut: heure_debut,
                fin: heure_fin,
            })
            .andWhere("(l.statut_livraison != :annule)", {
                annule: StatusLivraison.ANNULE
            })
            .getMany();
    }

    async findAll(): Promise<LivraisonEntity[]>{
        return this.livraisonRep.createQueryBuilder("livraison")
        .leftJoinAndSelect("livraison.client", "client")
        .leftJoinAndSelect("livraison.colis", "colis")
        .leftJoinAndSelect("colis.details_colis", "produit")
        .leftJoinAndSelect("livraison.problemes_livraison", "problemes")
        .orderBy("livraison.date_livraison", "DESC")
        .getMany();
    }

    async findById(id: number): Promise<LivraisonEntity>{
        if(!id) throw new BadRequestException("ID invalide");
        
        const matched = await this.livraisonRep.findOne({
            where: {id: id},
            relations: ["client", "colis"]
        });

        if(!matched) throw new NotFoundException(`Livraison avec ID:{${id}} est introuvable!`);

        return matched;
    }

    async findManyByIds(ids: number[]): Promise<LivraisonEntity[]>{
        if(!ids) throw new BadRequestException("ID invalide");
        
        const matched = await this.livraisonRep.find({
            where: {id: In(ids)},
            relations: ["client", "colis"]
        });

        if(!matched) throw new NotFoundException(`Livraison avec ID:{${Object.values(ids)}} sont introuvable!`);

        return matched;
    }
    
    async save(dto: LivraisonCreateDto): Promise<LivraisonEntity>{
        if(!dto) throw new BadRequestException("Données invalides");

        const livraison = await this.mapToLivraisonEntity(dto);

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
        
        const existing = await this.mapUpdateDtoToLivraisonEntity(id, dto);
        return this.livraisonRep.save(existing);
    }

    async updateStatut(id: number, statut: string){
        if(!statut || !id) throw new BadRequestException("Données invalides");
        const existing = await this.findById(id);
        const statuts = Object.values(StatusLivraison);
        const matched = statuts.filter((s) => s === statut)

        if(!matched || matched.length === 0) throw new BadRequestException(`Statut: {${statut}} inconnu! Voici les statuts acceptés: ${statuts}`);
        
        if(existing.statut_livraison === StatusLivraison.LIVRE || existing.statut_livraison === StatusLivraison.ANNULE){
            throw new BadRequestException(`Impossible de modifier le statut d'un livraison avec un statut: ${existing.statut_livraison}`);
        }
        existing.statut_livraison = statut;

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


    private getColis(dto: DetailColisDto[]){
        if(! Array.isArray(dto)) throw new BadRequestException("Colis doit être un tableau");
        const listColis: ColisEntity[] = [];

        dto.forEach(item => {
            const colis = new ColisEntity();
            const produit = new DetailColisEntity();

            produit.description_produit = item.description_produit;
            produit.poids_produit = item.poids_produit;
            produit.valeur_produit = item.valeur_produit;

            colis.statut_colis = StatusColis.EN_ATTENTE;
            colis.poids_total = produit.poids_produit;
            colis.details_colis = [];  
            colis.details_colis.push(produit);  

            listColis.push(colis);
        });

        return listColis;
    } 

    private batchGenerateCodeBarre(colis: ColisEntity[]){
        return Promise.all(colis.map(async c => {
            c.code_barre_client_colis = this.generateSequentialBarcode(c.id, "REF-CLIENT");
            return c;
        }));
    }

    private generateSequentialBarcode(id: number, prefix = 'PROD'): string {
        return `${prefix}-${id.toString().padStart(6, '0')}`;
    }

    private async mapToLivraisonEntity(dto: LivraisonCreateDto){
        const livraison: LivraisonEntity = new LivraisonEntity();
        const client = await this.clientService.findById(dto.id_client);
        const point_livraison = await this.pointLivraisonService.findByClient(dto.id_client);

        if(!point_livraison) throw new BadRequestException("Ce client n'est pas encore rattaché à un point de livraison");

        this.checkTime(dto.date_livraison, dto.heure_debut, dto.heure_fin, point_livraison);

        livraison.notes = dto.notes;
        livraison.date_livraison = dto.date_livraison;
        livraison.heure_debut =dto.heure_debut;
        livraison.heure_fin = dto.heure_fin;
        livraison.statut_livraison = StatusLivraison.EN_ATTENTE;
        livraison.colis = this.getColis(dto.colis);
        livraison.nom_destinataire = point_livraison.numero_magasin;
        livraison.adresse_principale = `${point_livraison.numero_rue}, ${point_livraison.nom_rue}, ${point_livraison.ville}`;
        livraison.complement_adresse = point_livraison.complement_adresse;
        livraison.ville = point_livraison.ville;
        livraison.pays = point_livraison.pays;
        livraison.code_postal = point_livraison.code_postal;
        livraison.client = client;
        livraison.nom_destinataire = client.nom_client;

        return livraison;
    }

    private async mapUpdateDtoToLivraisonEntity(id: number, dto: LivraisonUpdateDto){
        const existing = await this.findById(id);

        if(existing.statut_livraison !== StatusLivraison.DISTRIBUEUR_ASSIGNÉ && existing.statut_livraison !== StatusLivraison.EN_ATTENTE){
            throw new BadRequestException(`Un livraison avec statut ${existing.statut_livraison} n'est plus modifiable!`);
        }

        existing.notes = dto.notes;
        existing.date_livraison = dto.date_livraison?? existing.date_livraison;
        existing.heure_debut = dto.heure_debut?? existing.heure_debut;
        existing.heure_fin = dto.heure_fin?? existing.heure_fin;
        
        existing.nom_destinataire = dto.nom_destinataire?? existing.nom_destinataire;
        existing.adresse_principale = dto.adresse_principale?? existing.adresse_principale;
        existing.complement_adresse = dto.complement_adresse;
        existing.ville = dto.ville?? existing.ville;
        existing.pays = dto.pays;
        existing.code_postal = dto.code_postal?? existing.code_postal;

        this.checkTime(existing.date_livraison, existing.heure_debut, existing.heure_fin, existing.client.point_livraison);

        if(dto.id_client){
            const client = await this.clientService.findById(dto.id_client);
            if(!client) throw new BadRequestException("Client inexistant.");
            existing.client = client;
        }

        return existing;
    }

    private checkTime(date_livraison: string, heure_debut: string, heure_fin: string, pointLivraison: PointLivraisonEntity){
        const dateLivraison: Date = Utils.parseToFRDate(date_livraison);
        if(!pointLivraison) throw new BadRequestException("Point de livraison est null");

        pointLivraison.creneaux_livraison.forEach(horaire => {
            if(horaire.annee == dateLivraison.getFullYear() && horaire.jour_semaine.toLocaleLowerCase() == Utils.getDayInWord(dateLivraison)){
                if(heure_debut){    
                    if(
                        Utils.compareTwoTimes(horaire.heure_debut, heure_debut) <= 0 && 
                        Utils.compareTwoTimes(horaire.heure_fin, heure_debut) >= 0 && 
                        Utils.compareTwoTimes(horaire.heure_fin, heure_fin) >= 0
                    ){
                        return true;
                    }
                    
                    throw new BadRequestException(`L'heure de la livraison doit être comprise entre ${horaire.heure_debut} - ${horaire.heure_fin}`)
                }

                return true;
            }
        })
    }
}
