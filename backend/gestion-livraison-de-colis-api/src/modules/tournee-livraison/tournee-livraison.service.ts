import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { TourneeLivraisonEntity } from './tournee-livraison.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { plainToInstance } from 'class-transformer';
import { Repository } from 'typeorm';
import { TourneeLivraisonCreateDto } from 'src/common/dto/tournee-livraison/create-tournee-livraison-dto';
import { Livreur } from '../livreur/livreur.entity';
import { StatutTourneeLivaison } from 'src/common/enum/status-tournee-livraison';
import { Prestataire } from '../prestataire/prestataire.entity';
import { LivraisonTournee } from 'src/common/dto/tournee-livraison/liste-livraison-tournee-dto';
import { Utils } from 'src/common/utils/utils';
import { OrdreLivraisonEntity } from '../ordre-livraison/ordre-livraison.entity';
import { BordereauLivraisonEntity } from '../bordereau-livraison/bordereau-livraison.entity';

@Injectable()
export class TourneeLivraisonService {
    constructor(
        @InjectRepository(TourneeLivraisonEntity)
        private readonly tourneeRep: Repository<TourneeLivraisonEntity>,
        @InjectRepository(Livreur)
        private readonly livreurRep: Repository<Livreur>,
        @InjectRepository(Prestataire)
        private readonly prestataireRep: Repository<Prestataire>,
    ){}

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

                const dateTournee = Utils.parseToFRDate(tournee.date_tournee);
                const dateScanBL = Utils.parseToFRDate(bl.date_scan_bordereau);
                const dateScanBlString = `${dateScanBL.getDate()}/${dateScanBL.getMonth}/${dateScanBL.getFullYear}}`;
                const dateTourneeString = `${dateTournee.getDate()}/${dateTournee.getMonth}/${dateTournee.getFullYear}}`;
                
                if(dateScanBlString === dateTourneeString){
                    const livraison = new LivraisonTournee();
                    const pointLivraison = ordre.point_livraison;
        
                    livraison.idLivraison = ordre.livraison.id;
                    livraison.nombreColis = ordre.nbr_colis_reel;
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

        // trier les livraison par ordre décroissante pour chaque point de livraison
        for(const pl in groupByPointLivraison) {
            groupByPointLivraison[pl].sort((a, b) => {
                return b.heureDebut.localeCompare(a.heureDebut)
            });

            invertedOrderedlistLivraison.concat(groupByPointLivraison[pl]);
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

            orderedByPointLivraison.concat(groupByPointLivraison[pl]);
        }

        return orderedByPointLivraison;
    }

    async findAll(): Promise<TourneeLivraisonEntity[]> {
        return this.tourneeRep.find({relations: ["ordres_livraison"] });
    }

    async findAllByPlanning(idPlanning: number): Promise<TourneeLivraisonEntity[]> {
        return this.tourneeRep.createQueryBuilder("t")
        .innerJoinAndSelect("t.planning_livraison", "pl")
        .where("pl.id = :id", {id: idPlanning})
        .getMany();
    }
    
    async findById(id: number): Promise<TourneeLivraisonEntity> {
        const mathced = await this.tourneeRep.findOne({
            where: {id: id},
            relations: ["ordres_livraison"] 
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
        return this.tourneeRep.save(prepared);
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

    async update(id: number, dto: TourneeLivraisonCreateDto){
        if(!dto || !id) throw new BadRequestException("Données planning livraison invalides");
        const existing = await this.findById(id);

        if(existing.statut !== StatutTourneeLivaison.BROUILLON && existing.statut !== StatutTourneeLivaison.PLANIFIE){
            throw new BadRequestException(`Tournée avec statuts: ${existing.statut} n'est plus modifiable!`);
        }

        if(dto.id_livreur){
            const livreur: Livreur = await this.getLivreur(dto.id_livreur);
            existing.livreur = livreur;
        }

        existing.date_tournee = dto.date_tournee;

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

    private async getLivreur(id: number): Promise<Livreur>{
        const livreur: Livreur|null = await this.livreurRep.findOne({where: {id_livreur: id}});
        if(!livreur) throw new NotFoundException(`Livreur avec ID:{${id} est introuvable!}`);

        return livreur;
    }

    private async getTourneeLivraisonInstance(id_prestatiare: number, dto: TourneeLivraisonCreateDto){
        if(!dto) throw new BadRequestException("Données tournée livraison invalides");

        const tournee = plainToInstance(TourneeLivraisonEntity, dto);

        if(dto.id_livreur){
            const livreur: Livreur = await this.getLivreur(dto.id_livreur);
            tournee.livreur = livreur;
        }
        
        const matchedPrestataire = await this.prestataireRep.findOneBy({id_prestataire: id_prestatiare});
        if(!matchedPrestataire) throw new BadRequestException("Prestataire inexistant!");

        tournee.date_tournee = dto.date_tournee;
        tournee.prestataire = matchedPrestataire;
        tournee.statut = StatutTourneeLivaison.PLANIFIE;

        return tournee;        
    }
}
