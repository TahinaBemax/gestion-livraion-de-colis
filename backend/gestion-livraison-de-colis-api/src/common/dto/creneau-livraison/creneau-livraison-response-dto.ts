import { JourSemaine } from "src/common/enum/jour-semaine.enum";

export class CreneauLivraisonResponseDto {
    id: number;
    jour_semaine: JourSemaine|string;
    heure_debut: string;
    heure_fin: string;
    annee: number;
    point_livraison?: {
        id: number;
        numero_magasin: string;
        ville: string;
        departement?: string;
    };
}

export class CreneauLivraisonListResponseDto {
    data: CreneauLivraisonResponseDto[];
    total: number;
    message?: string;
}

export class CreneauLivraisonDeleteResponseDto {
    message: string;
}
