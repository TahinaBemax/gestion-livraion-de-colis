import { LivraisonEntity } from "src/modules/livraisons/livraison.entity";
import { NotificationEntity } from "src/modules/notification/notification.entity";
import { PointLivraisonEntity } from "src/modules/point-livraison/point-livraison.entity";

export class FicheOrdreLivraisonDto {
    nbr_colis_prevu: number;
    nbr_colis_reel: number;
    statut: string;
    date_scan_bordereau: string;
    date_scan_premier_colis: string; // au chargement
    date_scan_dernier_colis: string; // à la livraison
    //date_scan_PoD: string;
    notifications: NotificationEntity[];
    point_livraison: PointLivraisonEntity;
    livraisons: LivraisonEntity[];
}