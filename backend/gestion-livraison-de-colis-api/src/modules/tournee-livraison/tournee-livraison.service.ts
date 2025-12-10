import { BadRequestException, forwardRef, Inject, Injectable, NotFoundException } from '@nestjs/common';
import { TourneeLivraisonEntity } from './tournee-livraison.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { plainToInstance } from 'class-transformer';
import { Repository } from 'typeorm';
import { TourneeLivraisonCreateDto } from 'src/common/dto/tournee-livraison/create-tournee-livraison-dto';
import { Livreur } from '../livreur/livreur.entity';
import { StatutTourneeLivaison } from 'src/common/enum/status-tournee-livraison';
import { Prestataire } from '../prestataire/prestataire.entity';
import { LivraisonTournee } from 'src/common/dto/tournee-livraison/liste-livraison-tournee-dto';
import { OrdreLivraisonEntity } from '../ordre-livraison/ordre-livraison.entity';
import { BordereauLivraisonEntity } from '../bordereau-livraison/bordereau-livraison.entity';
import { TourneeLivraisonUpdateDto } from 'src/common/dto/tournee-livraison/update-tournee-livraison-dto';
import { LivraisonsService } from '../livraisons/livraisons.service';
import { StatusColis } from 'src/common/enum/status-colis.enum';
import { Utils } from 'src/common/utils/utils';
import { LivreurService } from '../livreur/livreur.service';
import { ColisEntity } from '../colis/colis.entity';

@Injectable()
export class TourneeLivraisonService {
    constructor(
        @InjectRepository(TourneeLivraisonEntity)
        private readonly tourneeRep: Repository<TourneeLivraisonEntity>,
        @InjectRepository(Prestataire)
        private readonly prestataireRep: Repository<Prestataire>,
        @Inject(forwardRef(() => LivreurService))
        private readonly livreurService: LivreurService,
        private readonly livraisonService: LivraisonsService
    ){}

    async getTourneeByDateTournee(dateTournee: string, idPrestataire?: number){
        if(!dateTournee) throw new BadRequestException("Date tournée est null!");

        const query = await this.tourneeRep.createQueryBuilder("t")
        .where("t.date_tournee = :date_tournee", {date_tournee: dateTournee})
        .leftJoinAndSelect("t.livreur", "livreur")
        .leftJoinAndSelect("t.prestataire", "prestataire")
        .leftJoinAndSelect("t.ordres_livraison", "ordres_livraison");
        if(idPrestataire){
            query.andWhere("prestataire.id_prestataire = :id_prestataire", {id_prestataire: idPrestataire});
        }
        return query.getMany();
    }

    /**
     * LISTE DES COLIS D'UNE LIVRAISON DANS UNE TOURNEE
     * @param idTournee 
     * @param idLivraison 
     * @param idUser 
     * @returns 
     */
    async getListColisByIDLivraison(idTournee: number, idLivraison: number, idUser: number) {
        if (!idTournee || !idLivraison || !idUser) throw new BadRequestException("Données invalides!");

        const tournee = await this.findById(idTournee);
        if (tournee.livreur.id_livreur !== idUser) throw new BadRequestException("Vous n'êtes pas autorisé à voir cette tournée de livraison!");
        
        const ordreLivraison: OrdreLivraisonEntity | undefined = tournee.ordres_livraison.find(ol => ol.livraison.id === idLivraison);
        if (!ordreLivraison) { 
            throw new NotFoundException(`Livraison avec ID:{${idLivraison}} est introuvable dans cette tournée de livraison!`);
        }

        const bl = await ordreLivraison.bordereau_livraison;
        if (!bl) {
            throw new BadRequestException("Veuillez générer un bordereau de livraison pour cet ordre de livraison avant de continuer!");
        } else if (!bl.date_scan_bordereau) {
            throw new BadRequestException("Le bordereau de livraison n'a pas encore été scanné!");
        }

        const livraisonIncomplet = await this.livraisonService.findLivraisonIncompleteByIdClient(ordreLivraison.livraison.client.id);
        const colisEnReliquat: ColisEntity[] = [];
        livraisonIncomplet.forEach(livraison => livraison.colis.forEach(colis => {
            if ((colis.statut_colis === StatusColis.RETOUR_EXPEDITEUR || colis.statut_colis === StatusColis.RELIQUAT) && colis.date_heure_retour_expediteur) {
                colis.statut_colis = StatusColis.RELIQUAT;
                colisEnReliquat.push(colis);
            }
        }));

        const all = ordreLivraison.livraison.colis.concat(colisEnReliquat);
        all.forEach(c => {
            c.date_heure_chargement = c.date_heure_chargement;
            c.date_heure_dechargement = c.date_heure_dechargement;
            c.date_heure_retour_expediteur = c.date_heure_retour_expediteur;
            c.date_heure_accuse_reception = c.date_heure_accuse_reception;
        });
        
        // Séparer les colis avec des statuts d'anomalie et reliquat
        const colisAnomalie = all.filter((c) => c.statut_colis === StatusColis.ANOMALIE || c.statut_colis === StatusColis.RELIQUAT);

        // Séparer les colis "normaux"
        const colisNormale = all.filter((c) => c.statut_colis !== StatusColis.ANOMALIE && c.statut_colis !== StatusColis.RELIQUAT);

        // Fusionner les deux listes
        const colisFinal = colisAnomalie.concat(colisNormale);

        // Fonction de tri personnalisée pour trier les colis par statut dans l'ordre spécifique
        const orderByStatus = {
            [StatusColis.RELIQUAT]: 1,
            [StatusColis.A_CHARGE_DANS_LA_CAMION]: 2,
            [StatusColis.CHARGE_DANS_LA_CAMION]: 3,
        };

        colisFinal.sort((a, b) => {
            // Comparer les colis en fonction de leur statut
            return (orderByStatus[a.statut_colis] || 0) - (orderByStatus[b.statut_colis] || 0);
        });

        return colisFinal;
    }


    private async getLivraisonsByTournee(tournee: TourneeLivraisonEntity): Promise<LivraisonTournee[]> {
        const listLivraison: LivraisonTournee[] = [];
        const ordresLivraison = tournee.ordres_livraison;
        var countBL = 0;

        // Map ordre de livraison en LivraisonTournée
        for (const ordre of ordresLivraison) {            
            const bl:BordereauLivraisonEntity = await ordre.bordereau_livraison;
            
            if(bl){
                countBL++;
                const date = bl.date_scan_bordereau;
                if(!date){
                    continue;
                }

                const dateTournee = new Date(tournee.date_tournee);
                const dateScanBL = new Date(date);

                const dateScanBlString = `${dateScanBL.getDate()}/${dateScanBL.getMonth()}/${dateScanBL.getFullYear()}`;
                const dateTourneeString = `${dateTournee.getDate()}/${dateTournee.getMonth()}/${dateTournee.getFullYear()}`;
                
                if(dateScanBlString === dateTourneeString){
                    const livraison = new LivraisonTournee();
                    const pointLivraison = ordre.point_livraison;
        
                    livraison.idLivraison = ordre.livraison.id;
                    livraison.nombreColis = ordre.nbr_colis_reel;
                    livraison.nombreColisCharge = Utils.countColisCharger(ordre.livraison);
                    livraison.heureDebut = ordre.livraison.heure_debut;
                    livraison.heureFin = ordre.livraison.heure_fin;
                    livraison.nomPointLivraison = `${pointLivraison.numero_magasin}`;
                    livraison.adresse = `${pointLivraison.ville}, ${pointLivraison.code_postal}, ${pointLivraison.numero_rue} - ${pointLivraison.nom_rue}`;
                    livraison.statut = ordre.livraison.statut_livraison;
        
                    listLivraison.push(livraison);
                }
            }
        }

        if(countBL > 0 && listLivraison.length === 0) {
            throw new BadRequestException("Aucun bordereau de livraison déja scané a été trouvé!");
        } else if(countBL == 0) {
            throw new BadRequestException("Aucun bordereau de livraison a été trouvé pour ce tournée!");
        }

        return listLivraison;
    }

    private async getOrdreLivraisonGroupedByPointLivraison(idTournee:number){
        if(!idTournee) throw new BadRequestException("ID tournee est null!");
    
        const tournee = await this.findById(idTournee);
        const listLivraison: LivraisonTournee[] = await this.getLivraisonsByTournee(tournee);    
        const ordresLivraison = tournee.ordres_livraison;
        const nomPointLivraison: Set<string> = new Set();
    
        //Obtenir la liste de point livraions distinct
        ordresLivraison.forEach(o => {
            const nomPL = o.point_livraison.numero_magasin;
            if (!nomPointLivraison.has(nomPL)) {
                nomPointLivraison.add(nomPL);
            }
        });
        
        //Groupe les livraison par point de livraison
        return listLivraison.reduce((acc, livraison) => {
            if(!acc[livraison.nomPointLivraison]){
                acc[livraison.nomPointLivraison] = [];
            }
    
            acc[livraison.nomPointLivraison].push(livraison);
            return acc;
        }, {} as Record<string, LivraisonTournee[]>);
    }

    async invertedOrdreLivraison(idTournee:number){
        const groupByPointLivraison: Record<string, LivraisonTournee[]> = await this.getOrdreLivraisonGroupedByPointLivraison(idTournee);
        const invertedOrderedlistLivraison: LivraisonTournee[] = [];

        // trier les livraison par ordre décroissant pour chaque point de livraison
        for (const pl in groupByPointLivraison) {
            groupByPointLivraison[pl].sort((a, b) => b.heureDebut.localeCompare(a.heureDebut));
            invertedOrderedlistLivraison.push(...groupByPointLivraison[pl]);
        }

        return invertedOrderedlistLivraison;
    }

    async ordreLivraisonOrderByPointLivraison(idTournee:number){
        const groupByPointLivraison:Record<string, LivraisonTournee[]> = await this.getOrdreLivraisonGroupedByPointLivraison(idTournee);
        const orderedByPointLivraison: LivraisonTournee[] = [];
        
        // trier les livraison par ordre décroissante pour chaque point de livraison
        for(const pl in groupByPointLivraison) {
            groupByPointLivraison[pl].sort((a, b) => {
                return a.heureDebut.localeCompare(b.heureDebut)
            });

            orderedByPointLivraison.push(...groupByPointLivraison[pl]);
        }
        
        return orderedByPointLivraison;
    }
    async tranjet(idTournee: number){
        const groupByPointLivraison:Record<string, LivraisonTournee[]> = await this.getOrdreLivraisonGroupedByPointLivraison(idTournee);
        const orderedByPointLivraison: LivraisonTournee[] = [];

        for (const pl in groupByPointLivraison) {
            orderedByPointLivraison.push(...groupByPointLivraison[pl]);
        }

        return this.trierLivraisons(orderedByPointLivraison);
        
    }
    private trierLivraisons(livraisons: LivraisonTournee[]): LivraisonTournee[] {
        // 1️⃣ Grouper les livraisons par nomPointLivraison
        const groupes = this.grouperParPointLivraison(livraisons);

        // 2️⃣ Trier chaque groupe par heureDebut (puis heureFin)
        for (const point in groupes) {
        groupes[point].sort((a, b) => {
            const debutA = this.convertirHeure(a.heureDebut);
            const debutB = this.convertirHeure(b.heureDebut);
            if (debutA !== debutB) return debutA - debutB;

            const finA = this.convertirHeure(a.heureFin);
            const finB = this.convertirHeure(b.heureFin);
            return finA - finB;
        });
        }

        // 3️⃣ Trier les groupes par leur plus petite heure de début
        const groupesTries = Object.entries(groupes).sort(([_, livraisonsA], [__, livraisonsB]) => {
        const debutMinA = this.convertirHeure(livraisonsA[0].heureDebut);
        const debutMinB = this.convertirHeure(livraisonsB[0].heureDebut);
        return debutMinA - debutMinB;
        });

        // 4️⃣ Reconstituer la liste triée finale
        return groupesTries.flatMap(([_, livraisons]) => livraisons);
    }

    private grouperParPointLivraison(livraisons: LivraisonTournee[]): Record<string, LivraisonTournee[]> {
        return livraisons.reduce((acc, livraison) => {
        const key = livraison.nomPointLivraison;
        if (!acc[key]) acc[key] = [];
        acc[key].push(livraison);
        return acc;
        }, {} as Record<string, LivraisonTournee[]>);
    }

    private convertirHeure(heure: string): number {
        if (!heure) return 0;
        const [h, m = '0', s = '0'] = heure.split(':');
        return parseInt(h) * 3600 + parseInt(m) * 60 + parseInt(s);
    }

    async findAll(): Promise<TourneeLivraisonEntity[]> {
        return this.tourneeRep.find({relations: ["ordres_livraison"] });
    }

    async findAllByIDPrestataire(idPrestataire: number): Promise<TourneeLivraisonEntity[]> {
        return this.tourneeRep.createQueryBuilder("t")
        .innerJoinAndSelect("t.prestataire", "prestataire")
        .leftJoinAndSelect("t.ordres_livraison", "ordres_livraison")
        .where("prestataire.id_prestataire = :id_prestataire", {id_prestataire: idPrestataire})
        .orderBy("t.date_tournee", "DESC")
        .orderBy("t.heure_debut", "DESC")
        .getMany();
    }
    
    async findById(id: number): Promise<TourneeLivraisonEntity> {
        const mathced = await this.tourneeRep.findOne({
            where: {id: id},
            relations: [
                "ordres_livraison",
                "ordres_livraison.bordereau_livraison",
                "ordres_livraison.point_livraison",
                "ordres_livraison.livraison"
            ]
        });

        if(!mathced) throw new NotFoundException(`Tournée Livraison avec ID:{${id}} est introuvable!`);

        return mathced;
    }

    async save(idPrestataire: number, dto: TourneeLivraisonCreateDto){
        if(!dto) throw new BadRequestException("Données tournée livraison invalides");

        const tournee = await this.getTourneeLivraisonInstance(idPrestataire, dto);
        const prepared = this.tourneeRep.create(tournee);
        return this.tourneeRep.save(prepared);
    }

    async batchSave(idPrestataire: number, dtos: TourneeLivraisonCreateDto[]){
        if(!dtos) throw new BadRequestException("Données tournée livraison invalides");

        const tournees:TourneeLivraisonEntity[] = await Promise.all(dtos.map(async (dto) => {
            return await this.getTourneeLivraisonInstance(idPrestataire, dto);
        }));

        const prepared = this.tourneeRep.create(tournees);
        const saved: TourneeLivraisonEntity[] = await this.tourneeRep.save(prepared);

        saved.forEach(t => {
            t.livreur.user.mot_de_passe = '';
        });

        return saved.map(tournee => {
            const {prestataire, ...withoutPrestataire} = tournee;
            return withoutPrestataire;
        });
    }

    async changeStatuts(id: number, statut:string ){
        if(!id) throw new BadRequestException("Donnée tournée de livraison invalide");
        const statuts = Object.values(StatutTourneeLivaison);

        if(statuts.filter(s => s === statut).length === 0) throw new BadRequestException(`Statut inconnue! Le statut doit être: ${statuts}`);

        const tournee = await this.findById(id);

        if(tournee.statut !== StatutTourneeLivaison.BROUILLON && tournee.statut !== StatutTourneeLivaison.PLANIFIE){
            throw new BadRequestException(`Impossible de modifier le statut en ${statut}!`);
        }
        
        tournee.statut = statut;
        await this.tourneeRep.save(tournee);

        return "Statuts modifié avec succés!";
    }

    async update(id: number, dto: TourneeLivraisonUpdateDto){
        if(!dto || !id) throw new BadRequestException("Données planning livraison invalides");
        const existing = await this.findById(id);

        if(existing.statut !== StatutTourneeLivaison.BROUILLON && existing.statut !== StatutTourneeLivaison.PLANIFIE){
            throw new BadRequestException(`Tournée avec statuts: ${existing.statut} n'est plus modifiable!`);
        }

        if(dto.id_livreur){
            const livreur: Livreur = await this.livreurService.findById(dto.id_livreur);
            existing.livreur = livreur;
        }

        existing.date_tournee = dto.date_tournee?? existing.date_tournee;
        existing.heure_debut = dto.heure_debut?? existing.heure_debut;
        existing.heure_fin = dto.heure_fin?? existing.heure_fin;
        

        return this.tourneeRep.save(existing);
    }

    async deleteDraft(id: number) {
        if(!id) throw new BadRequestException("Id tournée de livraison invalide");
        const existing = await this.findById(id);

        if(existing.statut !== StatutTourneeLivaison.BROUILLON && existing.statut !== StatutTourneeLivaison.ANNULE){
            throw new BadRequestException(`Tournée de livraison avec statuts: ${existing.statut} ne peut plus être supprimer!`);
        }

        return this.tourneeRep.delete(existing.id);
    }  

    private async getTourneeLivraisonInstance(id_prestatiare: number, dto: TourneeLivraisonCreateDto){
        if(!dto) throw new BadRequestException("Données tournée livraison invalides");

        const tournee = plainToInstance(TourneeLivraisonEntity, dto);

        if(dto.id_livreur){
            const livreur: Livreur = await this.livreurService.findById(dto.id_livreur);
            const isLivreurDisponible = await this.livreurService.isLivreurDisponible(livreur.id_livreur, dto.date_tournee);

            if(!isLivreurDisponible) 
                throw new BadRequestException(`Le livreur [${livreur.user.nom} ${livreur.user.prenom} avec ID: ${livreur.id_livreur}] n'est plus disponible pour cette date de tournée!`);

            tournee.livreur = livreur;
        }
        
        const matchedPrestataire = await this.prestataireRep.findOneBy({id_prestataire: id_prestatiare, est_active: true});
        if(!matchedPrestataire) throw new BadRequestException("Ce Prestataire est introuvable ou Il n'est plus actif!");

        tournee.date_tournee = dto.date_tournee;
        tournee.prestataire = matchedPrestataire;
        tournee.statut = StatutTourneeLivaison.PLANIFIE;

        return tournee;        
    }
}
