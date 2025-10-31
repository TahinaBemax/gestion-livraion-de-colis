import { BordereauLivraisonEntity } from './bordereau-livraison.entity';
import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { BordereauLivraisonCreateDto } from 'src/common/dto/bordereau-livraison/create-bordereau-livraison-dto';
import { Repository, In, DataSource, DeleteResult } from 'typeorm';
import { OrdreLivraisonEntity } from '../ordre-livraison/ordre-livraison.entity';
import { StatutOrdreLivraison } from 'src/common/enum/statut-ordre-livraison.enum';
import { OrdreLivraisonService } from '../ordre-livraison/ordre-livraison.service';
import { TourneeLivraisonEntity } from '../tournee-livraison/tournee-livraison.entity';
import { Utils } from 'src/common/utils/utils';
import { StatusLivraison } from 'src/common/enum/status-livraison.enum';
import { StatusColis } from 'src/common/enum/status-colis.enum';
import { ColisEntity } from '../colis/colis.entity';
import { TourneeLivraisonService } from '../tournee-livraison/tournee-livraison.service';
import { LivraisonEntity } from '../livraisons/livraison.entity';


@Injectable()
export class BordereauLivraisonService {
    constructor(
        @InjectRepository  (BordereauLivraisonEntity)
        private readonly bordereauRep: Repository<BordereauLivraisonEntity>, 
        private readonly ordreService: OrdreLivraisonService, 
        private readonly tourneeService: TourneeLivraisonService, 
        private readonly dataSource: DataSource
    ) {}


    async create(data: BordereauLivraisonCreateDto): Promise<BordereauLivraisonEntity[]> {
        const bordereaux: BordereauLivraisonEntity[] = await this.mapToBordereauLivraisonEntity(data);
        const prepared: BordereauLivraisonEntity[] = this.bordereauRep.create(bordereaux);
        return this.bordereauRep.save(prepared);
    }

    async findAll(): Promise<BordereauLivraisonEntity[]> {
        return this.bordereauRep.find({relations: ['ordre_livraison']});
    }

    async findById(id: string): Promise<BordereauLivraisonEntity> {
        const matched =  await this.bordereauRep.findOne({
            where: { id: id },
            relations: ['ordre_livraison']
        });

        if(!matched) throw new NotFoundException("Bordereau de livraison inexistant!");

        return matched;
    }

    /**
     * RECHERCHE UN BORDEREAU DE LIVRAISON PAR ID ORDRE DE LIVRAISON
     * @param id
     * @returns BordereauLivraisonEntity
     */
    async findByIdOrdreLivraison(id: number): Promise<BordereauLivraisonEntity|null> {
        const matched = await this.bordereauRep.createQueryBuilder("bordereau")
            .innerJoinAndSelect("bordereau.ordre_livraison", "ordre")
            .where("ordre.id = :ID", {ID: id})
            .getOne();

        return matched;
    }

    private async mapToBordereauLivraisonEntity(dto: BordereauLivraisonCreateDto): Promise<BordereauLivraisonEntity[]> {
        if(!dto) throw new Error('Données du bordereau de livraison manquantes');
        const bordereaux = new Array<BordereauLivraisonEntity>();
        const ordres_livraison: OrdreLivraisonEntity[] = await this.ordreService.findByIDS(dto.id_ordre_livraison);

        if(ordres_livraison.length === 0 ) throw new BadRequestException("Aucun ordre de livraison n'a été touvé");

        for (const ordre of ordres_livraison) {
            if(ordre.statut === StatutOrdreLivraison.EN_ATTENTE || ordre.statut === StatutOrdreLivraison.ANNULE)
                throw new BadRequestException(`Impossible de génèrer un bordereau de livraison pour un ordre de livraison avec statut: ${ordre.statut}`);
            
            const sequence = await this.dataSource.query("SELECT nextval('ref_bordereau')");
            const ref = 'BL-' + sequence[0].nextval.toString().padStart(8, '0');
            
            const bordereau = new BordereauLivraisonEntity();
            bordereau.id = ref;

            bordereau.date_bordereau = dto.date_bordereau ?? new Date().toISOString().split('T')[0];
            bordereau.date_livraison = (await ordre.tournee_livraison).date_tournee;
            bordereau.ordre_livraison = ordre;

            bordereau.nom_expediteur = "AdriColis";
            bordereau.adresse_expediteur = "Soavimasoandro, Antananarivo, Madagascar";
            bordereau.contact_expediteur = "+261 34 00 000 00";

            bordereau.nom_destinataire = ordre.point_livraison.numero_magasin;
            bordereau.adresse_destinataire =  ordre.point_livraison.numero_rue + ', ' + ordre.point_livraison.nom_rue + ', ' + ordre.point_livraison.ville;  
            bordereau.contact_destinataire = "";

            bordereaux.push(bordereau);
        }

        return bordereaux;
    }

    async delete(id: string): Promise<DeleteResult>{
        await this.findById(id);
        return await this.bordereauRep.delete(id);
    }

    async scanBordereauLivraison(idOrdreLivraison: number, idLivreur: number): Promise<Boolean>{
        try {
            const matched = await this.ordreService.findById(idOrdreLivraison);
            if(matched){
                const tournee: TourneeLivraisonEntity = await matched.tournee_livraison;
                const now = new Date();
                const dateTournee = Utils.parseToFRDate(tournee.date_tournee);
                if(now < dateTournee){
                    throw new BadRequestException(`Scan de bordereau n'est pas disponible qu'appartir du date ${dateTournee}`);
                }
                
                if(tournee.livreur.id_livreur != idLivreur){
                    throw new BadRequestException("Ce n'est pas votre bordereau de livraison!");
                }
                const bordereau = await this.findByIdOrdreLivraison(idOrdreLivraison);
                const query = this.dataSource.createQueryRunner();
                await query.connect();
                await query.startTransaction();
    
                if(bordereau){
                    try {
                        bordereau.date_scan_bordereau = new Date().toISOString();
                        await this.bordereauRep.save(bordereau);
                        matched.livraison.colis.forEach(c => c.statut_colis = StatusColis.A_CHARGE_DANS_LA_CAMION);
    
                        query.manager.save(BordereauLivraisonEntity, bordereau);
                        query.manager.save(ColisEntity, matched.livraison.colis);
                        
                        await query.commitTransaction();
                    } catch (error) {
                        await query.rollbackTransaction();
                        throw error;
                    }
                }

                return true;
            }

        } catch (error) {
            throw error;
        }
        return false
    }

    async proofOfDelivery(refBordereau: string): Promise<String>{
        if(!refBordereau){
            throw new BadRequestException("Référence du bordereau de livraison manquante");
        }

        const existingBordereau = await this.findById(refBordereau);
        if(!existingBordereau.date_scan_bordereau) throw new BadRequestException("Le bordereau de livraison n'a pas encore été scanné.");

        const ordreLivraison = existingBordereau.ordre_livraison;
        const tourneeLivraison = await ordreLivraison.tournee_livraison;
        const livraison = ordreLivraison.livraison;
        const colis = await this.tourneeService.getListColisByIDLivraison(tourneeLivraison.id, ordreLivraison.id, tourneeLivraison.livreur.id_livreur);
        var countColisAnomalie = 0;
        var countColisLivres = 0;

        colis.forEach(c => {
            if(c.statut_colis == StatusColis.ANOMALIE){
                countColisAnomalie += 1;
                c.statut_colis = StatusColis.RETOUR_EXPEDITEUR;
                c.date_heure_retour_expediteur = new Date().toISOString();
            }

            if(c.statut_colis == StatusColis.DECHARGE_DE_LA_CAMION){
                c.statut_colis = StatusColis.LIVRE;
                c.date_heure_accuse_reception = new Date().toISOString();
                countColisLivres += 1;
            }
        });

        if(countColisLivres === 0){
            throw new BadRequestException("Aucun colis livré. Veuillez décharger les colis du camion et les scanner d'abord. Preuve de livraison non enregistrée.");
        }

        livraison.statut_livraison = (countColisAnomalie > 0) ? StatusLivraison.LIVRAISON_PARTIELLE : StatusLivraison.LIVRE;
        ordreLivraison.statut = StatutOrdreLivraison.EFFECTUE;
        
        try {
            await this.dataSource.transaction(async manager => {
                await manager.save(ColisEntity, colis);
                await manager.save(LivraisonEntity, livraison);
                await manager.save(OrdreLivraisonEntity, ordreLivraison);
            });
        
            return "Preuve de livraison enregistrée avec succès.";
        } catch (error) {
            throw new BadRequestException("Erreur lors de l'enregistrement de la preuve de livraison.");
        }

    }
}
