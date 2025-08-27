
import { LivraisonEntity } from "src/modules/livraisons/livraison.entity";
import { PointLivraisonEntity } from "src/modules/point-livraison/point-livraison.entity";
import { TourneeLivraisonEntity } from "src/modules/tournee-livraison/tournee-livraison.entity";

export class OrdreLivraisonCreateDto {
    tournee: TourneeLivraisonEntity;
    pointLivraion: PointLivraisonEntity; 
    livraisons: LivraisonEntity[];
    incompletedLivraisons: LivraisonEntity[];
}