import { ApiProperty } from "@nestjs/swagger";
import { ProduitDto } from "./produit-dto";

export class ReponseBordereauLivraisonDto {
    @ApiProperty({ example: "Bordereau de livraison", description: "Titre du bordereau de livraison" })
    titre: string = "Bordereau de livraison";

    @ApiProperty({ example: 123, description: "Identifiant unique du bordereau de livraison" })
    id_bordereau_livraison: number;

    @ApiProperty({ example: "Jean Dupont", description: "Nom de l'expéditeur du colis" })
    nom_expediteur: string;

    @ApiProperty({ example: "12 rue de Paris, 75001 Paris", description: "Adresse de l'expéditeur" })
    adresse_expediteur: string;

    @ApiProperty({ example: "+33 6 12 34 56 78", description: "Contact téléphonique ou adresse mail de l'expéditeur" })
    contact_expediteur: string;

    @ApiProperty({ example: "Marie Martin", description: "Nom du destinataire du colis" })
    nom_destinataire: string;

    @ApiProperty({ example: "Paul", description: "Nom du livreur" })
    nom_livreur: string;

    @ApiProperty({ example: "Durand", description: "Prénom du livreur" })
    prenom_livreur: string;

    @ApiProperty({ example: "34 avenue des Champs, 75008 Paris", description: "Adresse du destinataire" })
    adresse_destinataire: string;

    @ApiProperty({ example: "+33 6 98 76 54 32", description: "Contact téléphonique du destinataire" })
    contact_destinataire: string;

    @ApiProperty({ type: [ProduitDto], description: "Liste des produits contenus dans le colis" })
    contenu: ProduitDto[];

    @ApiProperty({ example: 5.2, description: "Poids total du colis en kilogrammes" })
    poids_total: number;

    @ApiProperty({ example: 5.2, description: "Poids total du colis en kilogrammes" })
    total_produit: number;

    @ApiProperty({ example: "2024-06-01", description: "Date de création du bordereau de livraison (format YYYY-MM-DD)" })
    date_bordereau: string;

    @ApiProperty({ example: "2024-06-02", description: "Date prévue de livraison (format YYYY-MM-DD)" })
    date_livraison: string;
}