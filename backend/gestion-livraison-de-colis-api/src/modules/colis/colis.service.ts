import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { ColisEntity } from './colis.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { ColisCreateDto } from 'src/common/dto/colis/create-colis-dto';
import { plainToInstance } from 'class-transformer';
import { DetailColisDto } from 'src/common/dto/colis/detail-colis-dto';
import * as QRCode from 'qrcode';
import { StatusColis } from 'src/common/enum/status-colis.enum';
import { ColisUpdateDto } from 'src/common/dto/colis/update-colis-dto';
import { ProblemeColisEntity } from './probleme-colis.entity';
import { Livreur } from '../livreur/livreur.entity';
import { LivreurService } from '../livreur/livreur.service';
import { TourneeLivraisonEntity } from '../tournee-livraison/tournee-livraison.entity';
import { LivraisonsService } from '../livraisons/livraisons.service';
import { LivraisonEntity } from '../livraisons/livraison.entity';

@Injectable()
export class ColisService {
    constructor(
        @InjectRepository(ColisEntity)
        private readonly colisRep: Repository<ColisEntity>,
        private datasource: DataSource,
        private readonly livreurService: LivreurService,
        private readonly livraisonService: LivraisonsService
    ){}

    /**
     * SCAN DU COLIS AU MOMENT DE CHARGEMENT DU CAMION
     * @param idLivreur 
     * @param idColis
     * @returns message
     */

    async scanColisAuChargementCamion(idLivreur: number, idColis:number): Promise<string> {
        if(!idColis || !idLivreur) throw new BadRequestException("ID Colis ou ID Livreur invalid!");

        var message = "Code Barre Reconnu Et Colis Valide";
        const livreur: Livreur = await this.livreurService.findByUserID(idLivreur);
        
        if(!livreur.peut_faire_chargement_colis){
            throw new BadRequestException("Vous n'avez pas l'accés à cette fonctionnalité!");
        }
        
        if(!(await this.estRattacheLivreur(livreur.id_livreur, idColis))){
            throw new BadRequestException('Code barre reconnu et colis non rattaché à cette ordre');
        }

            const existingColis = await this.colisRep.createQueryBuilder("colis")
                .innerJoinAndSelect("colis.livraisons", "livraison")
                .leftJoinAndSelect("livraison.ordre_livraison", "ordre")
                .leftJoinAndSelect("ordre.bordereau_livraison", "bl")
                .where("colis.id = :idColis", {idColis})
                .getOne();

            if(!existingColis) throw new NotFoundException(`Code barre du colis non reconnu!`);
            const livraison = existingColis.livraisons;
            const bl = await livraison.ordre_livraison.bordereau_livraison;

            if(!bl || !bl.date_scan_bordereau) throw new BadRequestException("Impossible de scaner le colis le bordereau de livraison n'est pas encore scané!");
            
            if(existingColis.statut_colis === StatusColis.LIVRE || 
                existingColis.statut_colis === StatusColis.EN_COURS_LIVRAISON ||
                existingColis.statut_colis === StatusColis.CHARGE_DANS_LA_CAMION
            ){
                throw new BadRequestException('Ce colis est déja scanné!');
            }else if(existingColis.statut_colis === StatusColis.RELIQUAT){
                message = "code barre reconnu et colis en reliquat";
            }
    
            existingColis.statut_colis = StatusColis.CHARGE_DANS_LA_CAMION;
            existingColis.date_heure_chargement = new Date().toUTCString();
            this.colisRep.save(existingColis);

            return message;
    }

        /**
     * SCAN DU COLIS AU MOMENT DE CHARGEMENT DU CAMION
     * @param idLivreur 
     * @param idColis
     * @returns message
     */

    async scanColisAuDechargementCamion(idLivreur: number, idColis:number): Promise<string> {
        if(!idColis || !idLivreur) throw new BadRequestException("ID Colis ou ID Livreur invalid!");

        var message = "Code Barre Reconnu Et Colis Déchargé Du Camion";
        const livreur: Livreur = await this.livreurService.findByUserID(idLivreur);
        
        if(!(await this.estRattacheLivreur(livreur.id_livreur, idColis))){
            throw new BadRequestException(`Code Barre Reconnu mais Colis Non Rattaché à Cette Ordre de Livraison`);
        }
        const existingColis = await this.colisRep.createQueryBuilder("colis")
            .innerJoinAndSelect("colis.livraisons", "livraison")
            .leftJoinAndSelect("livraison.ordre_livraison", "ordre")
            .leftJoinAndSelect("ordre.bordereau_livraison", "bl")
            .where("colis.id = :idColis", {idColis})
            .getOne();

        if(!existingColis) throw new NotFoundException(`Code barre du colis non reconnu!`);

        if(existingColis.statut_colis !== StatusColis.CHARGE_DANS_LA_CAMION){
            throw new BadRequestException(`Ce colis n'est pas encore indiqué comme chargé dans le camion! Veuilez vérifier s'il vous plait.`);
        }
    
        existingColis.statut_colis = StatusColis.DECHARGE_DE_LA_CAMION;
        existingColis.date_heure_dechargement = new Date().toUTCString();
        this.colisRep.save(existingColis);

        return message;
    }


    /**
     * CHANGER LA STATU D'UN COLIS 
     * @param idColis
     * @returns message
     */

    async changerStatutColis(idColis:number, statut: string): Promise<string> {
        if(!idColis) throw new BadRequestException("ID Colis ou ID Livreur invalid!");
        var message = "Statut changé avec success!";
        var error = "Impossible de changer le statut d'un colis avec statut: ";

        const allowedStatut = Object.values(StatusColis);
        if(allowedStatut.filter(s => s === statut).length === 0) 
            throw new BadRequestException(`Statut inconnue! Le statut doit être: ${allowedStatut}`);

        try {
            const colis = await this.findById(idColis);

            if(colis.statut_colis === StatusColis.LIVRE) {
                throw new BadRequestException(`${error} ${colis.statut_colis}`);
            } 

            colis.statut_colis = statut
            this.colisRep.save(colis);
        } catch (error) {
            throw error;
        }

        return message;
    }

    /**
     * VERIER SI CE COLIS EST RATTACHE A CE LIVREUR
     * @return boolean
     */
    async estRattacheLivreur(idLivreur: number, idColis: number):Promise<boolean> {
        const tourneeRepository:Repository<TourneeLivraisonEntity> = this.datasource.manager.getRepository(TourneeLivraisonEntity);
        
        const count = await tourneeRepository.createQueryBuilder('tournee')
        .leftJoinAndSelect("tournee.ordres_livraison", "ordres")
        .leftJoinAndSelect("tournee.livreur", "livreur")
        .leftJoinAndSelect("ordres.livraison", "livraison")
        .leftJoinAndSelect("livraison.colis", "colis")
        .where("livreur.id_livreur = :idLivreur", {idLivreur: idLivreur})
        .andWhere("colis.id = :idColis", {idColis: idColis})
        .getCount();

        return count > 0;
    }

    /**
     * LES LIVRAISON TERMINEES ET EN COURS DE TRAITEMENT 
     * @param statuts 
     * @returns 
     */
    async countColisByLivraison(idLivraison: number): Promise<{ a_charger: number, charges: number }|undefined >{
        return await this.colisRep.createQueryBuilder("c")
            .innerJoinAndSelect("c.livraison", "livraison")
            .select([
                "SUM(CASE WHEN c.date_heure_chargement IS NULL THEN 1 ELSE 0 END) AS a_charger",
                "SUM(CASE WHEN c.date_heure_chargement IS NOT NULL THEN 1 ELSE 0 END) AS charges"
            ])
            .where("livraison.id = :idLivraison", {idLivraison})
            .getRawOne<{ a_charger: number, charges: number }>();
    }

    /**
     * LES COLIS D'UNE LIVRAISON
     * @param idLivraison 
     * @returns 
     */
    async findAllByIdLivraison(idLivraison: number): Promise<ColisEntity[]>{
        return await this.colisRep.createQueryBuilder("c")
            .innerJoin("c.livraison", "livraison")
            .innerJoinAndSelect("c.details_colis", "produit")
            .leftJoinAndSelect("c.problemes", "problemes")
            .where("livraison.id = :idLivraison", {idLivraison})
            .getMany();
    }

    async findAll(): Promise<ColisEntity[]>
    {
        return this.colisRep.find({relations: ["details_colis"]});
    }

    async findById(id: number): Promise<ColisEntity>
    {
        const mathced = await this.colisRep.findOne({
            where: {id: id},
            relations: ["details_colis"]
        });

        if(!mathced) throw new NotFoundException(`Colis avec ID:{${id}} est introuvable!`);

        return mathced;
    }

    async findByCodeBarreClient(code: string): Promise<ColisEntity>
    {
        const mathced = await this.colisRep.findOne({
            where: {code_barre_client_colis: code},
            relations: ["details_colis"]
        });

        if(!mathced) throw new NotFoundException(`Colis introuvable!`);

        return mathced;
    }

    async save(idLivraison: number, dto: ColisCreateDto): Promise<ColisEntity> {
        if(!dto || idLivraison) throw new BadRequestException("Données Colis invalides!");

        const livraison: LivraisonEntity = await this.livraisonService.findById(idLivraison);

        const colis: ColisEntity = plainToInstance(ColisEntity, dto); 
        colis.statut_colis = StatusColis.EN_ATTENTE;
        colis.poids_total = this.getSumWeight(dto.details_colis);
        colis.livraisons = livraison;

        const queryRunner = this.colisRep.manager.connection.createQueryRunner();
        await queryRunner.connect();
        await queryRunner.startTransaction();

        try {
            const savedColis = await queryRunner.manager.save(ColisEntity, colis);
            savedColis.code_barre_client_colis = await this.generateCodeBarreClient(savedColis);

            const updated = await queryRunner.manager.save(ColisEntity, savedColis);
            await queryRunner.commitTransaction()

            return updated;
        } catch (error) {
            await queryRunner.rollbackTransaction();
            throw error;
        } finally {
            await queryRunner.release();
        }
    }
    async batachSave(dto: ColisCreateDto[]): Promise<ColisEntity[]> {
        if(!dto) throw new BadRequestException("Données Colis invalides!");

        const colis: ColisEntity[] = plainToInstance(ColisEntity, dto);
        colis.forEach((c, index) => {
            c.statut_colis = StatusColis.EN_ATTENTE;
            c.poids_total = this.getSumWeight(dto[index].details_colis);
        });

        const queryRunner = this.colisRep.manager.connection.createQueryRunner();
        await queryRunner.connect();
        await queryRunner.startTransaction();

        try {
            const savedColis = await queryRunner.manager.save(ColisEntity, colis);

            savedColis.forEach( async (save) => save.code_barre_client_colis = await this.generateCodeBarreClient(save));

            const updated = await queryRunner.manager.save(ColisEntity, savedColis);
            await queryRunner.commitTransaction()

            return updated;
        } catch (error) {
            await queryRunner.rollbackTransaction();
            throw error;
        } finally {
            await queryRunner.release();
        }
    }

    async batachUpdateColisEntity(dto: ColisEntity[]): Promise<ColisEntity[]> {
        if(!dto) throw new BadRequestException("Données Colis invalides!");

        const queryRunner = this.colisRep.manager.connection.createQueryRunner();
        await queryRunner.connect();
        await queryRunner.startTransaction();

        try {
            const savedColis = await queryRunner.manager.save(ColisEntity, dto);
            await queryRunner.commitTransaction();

            return savedColis;
        } catch (error) {
            await queryRunner.rollbackTransaction();
            throw error;
        } finally {
            await queryRunner.release();
        }
    }

    async update(id: number, dto: ColisUpdateDto): Promise<ColisEntity>{
        if(!id || !dto) throw new BadRequestException("Données Colis invalides!");

        const existing = await this.findById(id);

        if(
            !(existing.statut_colis === StatusColis.A_CHARGE_DANS_LA_CAMION || 
                existing.statut_colis === StatusColis.EN_ATTENTE || 
                existing.statut_colis !== StatusColis.ANOMALIE)
        ){
            throw new BadRequestException(`Impossible de modifier un colis avec statut ${existing.statut_colis}`);
        }
        
        existing.poids_total = dto.poids_produit?? existing.poids_total;
        existing.statut_colis = dto.status?? existing.statut_colis;

        const produit = existing.details_colis[0];

        produit.description_produit = dto.description_produit?? produit.description_produit;
        produit.poids_produit = dto.poids_produit?? produit.poids_produit;
        produit.valeur_produit = dto.valeur_produit?? produit.valeur_produit;
        
        return this.colisRep.save(existing);
    }
    
    // async signalProbleme(id: number, dto: ProblemeColisCreateDto): Promise<ProblemeColisEntity>{
    //     if(!id || !dto) throw new BadRequestException("Données Colis invalides!");
        
    //     const existing = await this.findById(id);
    //     const probleme = plainToInstance(ProblemeColisEntity, dto);
    //     probleme.colis = existing;

    //     const prepared = this.problemeRep.create(probleme);
    //     return this.problemeRep.save(prepared);
    // }

    async delete(id: number):Promise<string>{
        if(!id) throw new BadRequestException("ID colis invalide!");
        const existing = await this.findById(id); 
        
        await this.colisRep.delete(id);
        return "Colis supprimé avec succés"!
    }

    async getDateFirstColisLoadedForTournee(idTournee: number): Promise<string>{
        const result = await this.datasource.query(`
            SELECT pcc.date_heure_chargement 
            FROM premier_colis_au_chargement pcc 
            WHERE pcc.id_tournee = $1 AND date_heure_chargement IS NOT NULL
            ORDER BY pcc.date_heure_chargement DESC LIMIT 1`, [idTournee]
        );

        return (result) ? result[0].date_heure_chargement : '';
    }

    async getDateLastColisDechargmentForTournee(idTournee: number): Promise<string>{
        const result = await this.datasource.query(`
            SELECT pcc.date_heure_dechargement 
            FROM dernier_colis_au_dechargement pcc 
            WHERE pcc.id_tournee = $1 AND date_heure_dechargement IS NOT NULL
            ORDER BY pcc.date_heure_dechargement DESC LIMIT 1;`, [idTournee]
        );

        return (result) ? result[0].date_heure_dechargement : '';
    }

    private getSumWeight(detailsColis: DetailColisDto[]) {
        let sum = 0;
        if(!detailsColis || detailsColis.length === 0) return sum;

        detailsColis.forEach(d => {
            sum += d.poids_produit;
        });

        return sum;
    }

    private async generateCodeBarreClient(colis: ColisEntity): Promise<string> {
        const data: string = `${colis.id}:CLIENT-ID`;
        
        return QRCode.toDataURL(data);
    }


}
