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


@Injectable()
export class BordereauLivraisonService {
    constructor(
        @InjectRepository  (BordereauLivraisonEntity)
        private readonly bordereauRep: Repository<BordereauLivraisonEntity>, 
        private readonly ordreService: OrdreLivraisonService, 
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
        this.findById(id);
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
    
                if(bordereau){
                    bordereau.date_scan_bordereau = new Date().toUTCString();
                    this.bordereauRep.save(bordereau);
                }

                return true;
            }

        } catch (error) {
            throw error;
        }
        return false
    }
}
