import { parse } from 'date-fns';
import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { In, Repository } from 'typeorm';
import { LivraisonEntity } from './livraison.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { ColisEntity } from '../colis/colis.entity';
import { PointLivraisonEntity } from '../point-livraison/point-livraison.entity';
import { LivraisonCreateDto } from 'src/common/dto/livraison/create-livraison-dto';
import { StatusLivraison } from 'src/common/enum/status-livraison.enum';
import { ProblemeLivraisonCreateDto } from 'src/common/dto/livraison/create-probleme-livraison-dto';
import { ProblemeLivraisonEntity } from './probleme-livraison.entity';
import { ColisCreateDto } from 'src/common/dto/colis/create-colis-dto';
import { StatusColis } from 'src/common/enum/status-colis.enum';
import { LivraisonUpdateDto } from 'src/common/dto/livraison/update-livraison-dto';
import { plainToInstance } from 'class-transformer';
import { DetailColisEntity } from '../colis/detail-colis.entity';
import { ClientEntity } from '../client/client.entity';
import { Prestataire } from '../prestataire/prestataire.entity';

@Injectable()
export class LivraisonsService {
    constructor(
        @InjectRepository(LivraisonEntity)
        private readonly livraisonRep: Repository<LivraisonEntity>,
        @InjectRepository(PointLivraisonEntity)
        private readonly plRep: Repository<PointLivraisonEntity>,
        @InjectRepository(ProblemeLivraisonEntity)
        private readonly problemeLivraisonRep: Repository<ProblemeLivraisonEntity>,
        @InjectRepository(ClientEntity)
        private readonly clientRep: Repository<ClientEntity>
    ){}

    /**
     * LES LIVRAISON TERMINEES ET EN COURS DE TRAITEMENT 
     * @param statuts 
     * @returns 
     */
    async findByStatuts(statuts: StatusLivraison[]): Promise<LivraisonEntity[]>{
        return await this.livraisonRep.findBy({statut_livraison: In(statuts)});
    }

    /**
     * LES LIVRAISON TERMINEES ET EN COURS DE TRAITEMENT 
     * @param statuts 
     * @returns 
     */
    async filterBy(idPrestataire?: string, idClient?: string, date?: string, zoneGeographique?: string): Promise<LivraisonEntity[]>{
        const query = this.livraisonRep.createQueryBuilder("l")
        .leftJoinAndSelect("l.point_livraison", "pl")
        .innerJoin("pl.prestataire", "p")
        .leftJoinAndSelect("l.client", "c")
        
        if(date) query.where("l.date_livraison = :date", {date: date});
        
        if(zoneGeographique) query.andWhere("l.code_postal = :code OR l.ville = :ville", {code: zoneGeographique, ville: zoneGeographique});

        if(idPrestataire) query.andWhere("p.id_prestataire = :idPrestataire", {idPrestataire: parseInt(idPrestataire)});

        if(idClient) query.andWhere("c.id = :idClient", {idClient: parseInt(idClient)});

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
            .innerJoinAndSelect("l.point_livraison", "pl")
            .innerJoinAndSelect("l.colis", "c")
            .where("pl.id =:id", { id: idPL })
            .andWhere("(l.statut_livraison =:echec OR l.statut_livraison =:retourne_expediteur OR l.statut_livraison =:partielle)", {
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
            .andWhere("(l.statut_livraison != :annule)", {
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

        if(!matched || matched.length === 0) throw new BadRequestException(`Statut: {${statut}} inconnue! Voici les statuts acceptés: ${statuts}`);
        
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


    private getColis(dto: ColisCreateDto[]){
        if(! Array.isArray(dto)) throw new BadRequestException("Colis doit être un tableau");

        const colis: ColisEntity[] = plainToInstance(ColisEntity, dto);
        return colis.map(c => {
            c.statut_colis = StatusColis.EN_ATTENTE;
            c.poids_total = this.getSumWeight(c.details_colis);  
            
            return c;
        });
    } 

    private getSumWeight(detailsColis: DetailColisEntity[]) {
        let sum = 0;
        if(!detailsColis || detailsColis.length === 0) return sum;

        detailsColis.forEach(d => {
            sum += d.poids_produit;
        });

        return sum;
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

        livraison.notes = dto.notes;
        livraison.date_livraison = dto.date_livraison;
        livraison.heure_debut =dto.heure_debut;
        livraison.heure_fin = dto.heure_fin;
        livraison.statut_livraison = StatusLivraison.EN_ATTENTE;
        livraison.colis = this.getColis(dto.colis);
        
        if(dto.id_point_livraison){
            const point_livraison = await this.plRep.findOneBy({id: dto.id_point_livraison});
            if(!point_livraison) throw new BadRequestException("Point de livraison inexistant.");

            livraison.nom_destinataire = point_livraison.numero_magasin;
            livraison.adresse_principale = point_livraison.numero_rue + ", " + point_livraison.nom_rue + ", " + point_livraison.ville;
            livraison.complement_adresse = point_livraison.complement_adresse;
            livraison.ville = point_livraison.ville;
            livraison.pays = point_livraison.pays;
            livraison.code_postal = point_livraison.code_postal;
            livraison.point_livraison = point_livraison;
        }

        if(dto.id_client){
            const client = await this.clientRep.findOneBy({id: dto.id_client});
            if(!client) throw new BadRequestException("Client inexistant.");
            livraison.client = client;

            livraison.nom_destinataire = client.nom_client;
        }

        return livraison;
    }

    private async mapUpdateDtoToLivraisonEntity(id: number, dto: LivraisonUpdateDto){
        const existing = await this.findById(id);

        existing.notes = dto.notes;
        existing.date_livraison = dto.date_livraison?? existing.date_livraison;
        existing.heure_debut =dto.heure_debut;
        existing.heure_fin = dto.heure_fin;
        
        if(dto.id_point_livraison){
            const point_livraison = await this.plRep.findOneBy({id: dto.id_point_livraison});
            if(!point_livraison) throw new BadRequestException("Point de livraison inexistant.");

            existing.nom_destinataire = point_livraison.numero_magasin;
            existing.adresse_principale = point_livraison.numero_rue + ", " + point_livraison.nom_rue + ", " + point_livraison.ville;
            existing.complement_adresse = point_livraison.complement_adresse;
            existing.ville = point_livraison.ville;
            existing.pays = point_livraison.pays;
            existing.code_postal = point_livraison.code_postal;
            existing.point_livraison = point_livraison;
        }

        if(dto.id_client){
            const client = await this.clientRep.findOneBy({id: dto.id_client});
            if(!client) throw new BadRequestException("Client inexistant.");
            existing.client = client;

            existing.nom_destinataire = client.nom_client;
        }

        return existing;
    }
}
