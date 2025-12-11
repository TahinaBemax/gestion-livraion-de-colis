
import { LivraisonEntity } from "src/modules/livraisons/livraison.entity";
import { PointLivraisonEntity } from "src/modules/point-livraison/point-livraison.entity";
import { TourneeLivraisonEntity } from "src/modules/tournee-livraison/tournee-livraison.entity";

export class OrdreLivraisonDto {
    tournee: TourneeLivraisonEntity;
    pointLivraion: PointLivraisonEntity; 
    livraison: LivraisonEntity;
}