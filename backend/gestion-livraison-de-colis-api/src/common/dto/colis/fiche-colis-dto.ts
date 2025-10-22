import { DetailColisEntity } from "src/modules/colis/detail-colis.entity";

export class FicheColisDto {
    idColis: number;
    nom_client: string;
    prenom_client: string;
    numero_telephone: string;
    adresse_mail: string;
    adresse_principale: string;
    complement_adresse?: string;
    ville: string;
    pays?: string;
    code_postal: string;
    poids_total: number;
    details_colis: DetailColisEntity[];
}