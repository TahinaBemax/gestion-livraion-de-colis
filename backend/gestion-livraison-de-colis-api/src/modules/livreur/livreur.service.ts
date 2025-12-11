import { LivreurScoringClassement } from './../../common/dto/livreur/scroring-classement-dto';
import { BadRequestException, forwardRef, Inject, Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { Livreur } from './livreur.entity';
import { CreateLivreurDto } from 'src/common/dto/livreur/create-livreur-dto';
import { User } from '../user/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { LiveurMapper } from './livreur.mapper';
import { Prestataire } from '../prestataire/prestataire.entity';
import { LivreurUpdateDto } from 'src/common/dto/livreur/update-livreur-dto';
import { StatusLivraison } from 'src/common/enum/status-livraison.enum';
import { TourneeLivraisonService } from '../tournee-livraison/tournee-livraison.service';
import { TourneeLivraisonEntity } from '../tournee-livraison/tournee-livraison.entity';

@Injectable()
export class LivreurService {
    constructor(
        @InjectRepository(Livreur)
        private readonly livreurRepo: Repository<Livreur>, 
        @InjectRepository(User)
        private readonly userRepo: Repository<User>,
        @InjectRepository(Prestataire)
        private readonly prestataireRep: Repository<Prestataire>,
        @Inject(forwardRef(() => TourneeLivraisonService))
        private readonly tourneeService: TourneeLivraisonService,
        private readonly livreurMapper: LiveurMapper,
    ){}

    /**
     * Verifie si un livreur est libre pour un tournée
     */
    async isLivreurDisponible(idLivreur: number, date_tournee?: string): Promise<boolean>{
        if(!date_tournee){
            date_tournee = new Date().toISOString().split('T')[0];
        }

        const matched =  await this.livreurRepo.createQueryBuilder("livreur")
        .leftJoinAndSelect("livreur.tournees_livraison", "tournee")
        .where("livreur.id_livreur = :idLivreur", {idLivreur})
        .andWhere("tournee.date_tournee = :date_tournee", {date_tournee})
        .getOne();

        return matched ? false : true;  
    }

    /**
     * Verifie si un livreur est libre pour un tournée
     */
    async findAllLivreurDisponible(idPrestataire?: number, date_tournee?: string): Promise<Livreur[]>{
        if(!date_tournee){
            date_tournee = new Date().toISOString().split('T')[0];
        }

        const tournee: TourneeLivraisonEntity[] = await this.tourneeService.getTourneeByDateTournee(date_tournee, idPrestataire);

        const query = this.livreurRepo.createQueryBuilder("livreur")
        .leftJoin("livreur.tournees_livraison", "tournee")
        .innerJoinAndSelect("livreur.user", "user");

        if(idPrestataire){
            query.innerJoin(Prestataire, 'p', 'p.id_prestataire = user.id_prestataire')
            .andWhere('p.id_prestataire = :idPrestataire', {idPrestataire});
        }
        
        query.andWhere("user.est_active = :est_active", {est_active: true})
        const livreurs = await query.getMany();

        const livreurDisponible = livreurs.filter( (l) => {
            const isLivreurDansTournee = tournee.find( (t) => t.livreur.id_livreur === l.id_livreur);
            return !isLivreurDansTournee;
        });
        
        return livreurDisponible.map( (l) => {
            l.user.mot_de_passe = "";
            return l;
        });
    }
    
    /**
     * Total livraison rattacher à un Livreur
     */

    async getLivraisonStatistique(idLivreur?: number, date_debut?: string, date_fin?: string, statut?: string): Promise<any>{
        const query = this.livreurRepo.createQueryBuilder("livreur")
        .leftJoin("livreur.tournees_livraison", "tournee")
        .leftJoin("tournee.ordres_livraison", "ordre")
        .innerJoin("ordre.livraison", "livraison")
        .select("COUNT(DISTINCT livraison.id)", 'total')
        .addSelect("livreur.id_livreur", 'idLivreur')
        
        if(idLivreur){
            query.andWhere("livreur.id_livreur = :idLivreur", {idLivreur: idLivreur})
        }

        if(date_debut && !date_fin){
            query.andWhere("DATE(tournee.date_tournee) = DATE(:date)", {date: date_debut});
        } else if(date_debut && date_fin){
            query.andWhere("DATE(tournee.date_tournee) BETWEEN DATE(:debut) AND DATE(:fin)", {debut: date_debut, fin: date_fin});
        }

        if(statut){
            switch (statut) {
                case 'livre':
                    query.andWhere("(livraison.statut_livraison = :statut OR livraison.statut_livraison = :partielle)", {
                        statut: StatusLivraison.LIVRE,
                        partielle: StatusLivraison.LIVRAISON_PARTIELLE
                    })
                    break;
                case 'echec':
                    query.andWhere("(livraison.statut_livraison = :echec OR livraison.statut_livraison = :retourne)", {
                        echec: StatusLivraison.ECHEC_LIVRAISON,
                        retourne: StatusLivraison.RETOUR_EXPEDITEUR,
                    })
                    break;
                default:
                    break;
            }
        }
        query.groupBy("livreur.id_livreur");
        return await query.getRawOne();
    }
    /**
     * Total livraison rattacher à un Livreur
     */

    async getLivreurStatistique(idLivreur: number, date_tournee: string): Promise<LivreurScoringClassement> {
        // Stat global
        const totalLivraisonGlobal: any = await this.getLivraisonStatistique(idLivreur);

        // Stat jour
        const totalLivraisonJournalier: any = await this.getLivraisonStatistique(idLivreur, date_tournee);
        const totalLivraisonJournalierEffectue: any = await this.getLivraisonStatistique(idLivreur, date_tournee, undefined, 'livre');

        // Convertir la date_tournee en objet Date
        const date = new Date(date_tournee);

        // Trouver le lundi de la semaine (0 = dimanche, 1 = lundi, ...)
        const day = date.getDay();
        const diffToMonday = (day === 0 ? -6 : 1) - day; // Si dimanche, reculer de 6 jours
        const lundi = new Date(date);
        lundi.setDate(date.getDate() + diffToMonday);

        // Trouver le dimanche (lundi + 6 jours)
        const dimanche = new Date(lundi);
        dimanche.setDate(lundi.getDate() + 6);

        const dateDebut = lundi.toISOString().split('T')[0];
        const dateFin = dimanche.toISOString().split('T')[0];

        // Stat semaine
        const totalLivraisonGlobalSemaine: any = await this.getLivraisonStatistique(
            idLivreur,
            dateDebut,
            dateFin
        );

        const totalLivraisonGlobalSemaineEffectue: any = await this.getLivraisonStatistique(
            idLivreur,
            dateDebut,
            dateFin,
            'livre'
        );

        // Préparer le résultat
        const statistique = new LivreurScoringClassement();
        statistique.idLivreur = idLivreur;
        statistique.totalLivraisonGlobal = totalLivraisonGlobal.total;
        statistique.nbrLivraisonJour = totalLivraisonJournalier.total;
        statistique.totalLivraisonEffectueJour = totalLivraisonJournalierEffectue.total;
        statistique.nbrLivraisonSemaine = totalLivraisonGlobalSemaine.total;
        statistique.totalLivraisonEffectueSemaine = totalLivraisonGlobalSemaineEffectue.total;

        return statistique;
    }

    
    async getTotalLivraisonEchec(idLivreur: number): Promise<any[]>{
        const query = this.livreurRepo.createQueryBuilder("livreur")
        .leftJoinAndSelect("livreur.tournees_livraison", "tournee")
        .leftJoinAndSelect("tournee.ordres_livraison", "ordre")
        .leftJoinAndSelect("ordre.livraison", "livraison")
        .select("COUNT(livraison.id)", 'total')
        .addSelect("livreur.id", 'idLivreur')

        if(idLivreur){
            query.andWhere("livreur.id = :idLivreur", {idLivreur: idLivreur})
        }
        query.groupBy("livreur.id");
        return await query.getRawMany();
    }
    /**
     * 
     * @param id 
     * @returns 
     */
    async findByUserID(id: number): Promise<Livreur>{
        const matched = await this.livreurRepo.createQueryBuilder("l")
        .innerJoinAndSelect("l.user", "u")
        .innerJoinAndSelect("l.categorie_livreur", "cl")
        .leftJoinAndSelect("l.livreurs_temporaire", "lt")
        .where("u.id_utilisateur = :id", {id})
        .getOne();

        if(!matched) throw new NotFoundException("Livreur Introuvable");
        const {mot_de_passe, ...withoutPassword } = matched.user
        return matched
    }

    async create(idPrestataire: number, dto: CreateLivreurDto): Promise<Livreur> {
        if (!dto) throw new BadRequestException("Données Livreur invalides");
        if (!idPrestataire) throw new BadRequestException("L'IdPrestataire est null");
        const queryRunner = this.livreurRepo.manager.connection.createQueryRunner();

        try {
            const prestataire = await this.prestataireRep.findOneBy({id_prestataire: idPrestataire});
            if(!prestataire) throw new NotFoundException(`Prestataire id:${idPrestataire} Introuvable!`);
    
            await queryRunner.connect();
            await queryRunner.startTransaction();


            const livreur = await this.livreurMapper.prepareData(prestataire, dto);
            var savedLivreur = await queryRunner.manager.save(Livreur, livreur);
            
            await queryRunner.commitTransaction();
            return { ...savedLivreur, user: { ...savedLivreur.user, mot_de_passe: "" } };
        } catch (error) {
            await queryRunner.rollbackTransaction();
            throw error;
        } finally {
            await queryRunner.release();
        }
    }

    async findAllLivreurs(): Promise<Livreur[]>{
        const livreurs = await this.livreurRepo.find({relations: ["user"]});

        return livreurs.map( (l) => {
            const {mot_de_passe, ...withoutPassword } = l.user
            return l;
        });
    }

    async findAllLivreursByPrestataire(id:number): Promise<Livreur[]>{
        const livreurs = await this.livreurRepo
            .createQueryBuilder('livreur')
            .innerJoinAndSelect('livreur.user', 'user')
            .innerJoin(Prestataire, 'p', 'p.id_prestataire = user.id_prestataire')
            .addSelect('p')
            .where('p.id_prestataire = :id', { id })
            .getMany();

        return livreurs.map( (l) => {
            const {mot_de_passe, ...withoutPassword } = l.user
            return l;
        });
    }

    async findById(id:number): Promise<Livreur>{
        const livreur = await this.livreurRepo.findOne({
            where: {id_livreur: id},
            relations: ["user"]
        });

        if(!livreur) throw new NotFoundException(`Livreur id:${id} Introuvable`);
        const {mot_de_passe, ...withoutPassword } = livreur.user
        return livreur;
    }

    async changeAccountStatus(id_prestataire:number, id: number, isActivate:boolean): Promise<string>{
        const matched = await this.findById(id);
        const prestataire = await matched.user.prestataire;
        if(id_prestataire != prestataire?.id_prestataire) 
            throw new UnauthorizedException("Vous n'avez pas le droit de modifier ce livreur!");

        if(matched.user.est_active !== isActivate){
            matched.user.est_active = isActivate;
            this.userRepo.save(matched.user);
        }

        return `Compte Livreur ${(isActivate) ? 'activé': 'desactivé'} avec succés!`;
    }

    /**
     * ACTIVE OU DESACTIVE LA FONCTIONNALITE SCAN COLIS AU MOMENT DU CHARGEMENT DU CAMION
     * @param id_prestataire 
     * @param id 
     * @param canScan 
     * @returns 
     */
    async canScan(id_prestataire:number, id: number, canScan: boolean): Promise<string>{
        const matched = await this.findById(id);
        const prestataire = await matched.user.prestataire;
        if(id_prestataire != prestataire?.id_prestataire) 
            throw new UnauthorizedException("Vous n'avez pas le droit de modifier ce livreur!");

        matched.peut_faire_chargement_colis = canScan;
        this.livreurRepo.save(matched);

        return `Scan au moment du chargement du camion ${(canScan) ? 'activé' : 'desactivé'} avec succés!`;
    }

    async update(idLivreur: number, data: LivreurUpdateDto):Promise<any> {
        if(!data) throw new BadRequestException("Données Livreur invalides");
        if(!idLivreur) throw new BadRequestException("L'id du livreur est null");

        const matched = await this.findById(idLivreur);
        matched.user = {...matched.user, ...data};
        matched.categorie_livreur = data.id_categorie_livreur ? await this.livreurMapper['getCategorieLivreurByIdIfExist'](data.id_categorie_livreur) : matched.categorie_livreur;

        const updated = await this.livreurRepo.save(matched);
        const {mot_de_passe, ...withoutPassword } = updated.user
        return withoutPassword;
    }

    /**
     * Liste des livreurs qui ont déjà scanné un bordereau
     * et qui ont une tournée aujourd'hui
     * @param idPrestataire ID du prestataire
     */
    async findLivreurEncoursLivraison(idPrestataire?: number): Promise<Livreur[]> {
        const query = this.livreurRepo.createQueryBuilder("l")
            .innerJoinAndSelect("l.user", "user") 
            .leftJoin("l.tournees_livraison", "tl") 
            .leftJoin("tl.ordres_livraison", "ordre")
            .leftJoin("ordre.bordereau_livraison", "bl")

        if(idPrestataire){
            query.innerJoinAndSelect("user.prestataire", "prestataire") 
                .andWhere("prestataire.id_prestataire = :id", {id: idPrestataire})
        }
        
        const livreurs = await query
            .where("DATE(:now) = DATE(bl.date_scan_bordereau) AND bl.date_preuve_livraison IS NULL", {now: new Date().toISOString().split('T')[0]})
            .getMany();

        // retirer le mot de passe
        return livreurs.map((l) => {
            const { mot_de_passe, prestataire ,...safeUser } = l.user;
            l.user = safeUser as any;
            return l;
        });
    }

}
