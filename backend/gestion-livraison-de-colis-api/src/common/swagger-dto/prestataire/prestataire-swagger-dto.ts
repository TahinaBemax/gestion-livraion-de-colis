import { ApiProperty } from '@nestjs/swagger';
export class PrestataireSwaggerDto {

    @ApiProperty({
        description: "Identifiant unique du prestataire",
        example: 123,
        required: false
    })
    id_prestataire: number;

    @ApiProperty({
        description: "Nom de l'entreprise du prestataire",
        example: "Entreprise Dupont",
    })
    nom_entreprise: string;

    @ApiProperty({
        description: "Numéro d'identification fiscale du prestataire (optionnel)",
        example: "123456789",
        required: true,
    })
    nif: string;

    @ApiProperty({
        description: "Numéro de statut du prestataire (optionnel)",
        example: "123-4567890",
        required: false,
    })
    stat: string;

    @ApiProperty({
        description: "Première ligne d'adresse du prestataire",
        example: "123 Rue de Paris",
    })
    adresse1: string;

    @ApiProperty({
        description: "Deuxième ligne d'adresse du prestataire (optionnel)",
        example: "Appartement 45",
        required: false,
    })
    adresse2?: string;

    @ApiProperty({
        description: "Nom du département du prestataire",
        example: "Ile-de-France",
    })
    departement: string;

    @ApiProperty({
        description: "État ou province du prestataire (optionnel)",
        example: "Île-de-France",
        required: false,
    })
    etat?: string;

    @ApiProperty({
        description: "Ville où se situe le prestataire",
        example: "Paris",
    })
    ville: string;

    @ApiProperty({
        description: "Pays où se situe le prestataire",
        example: "France",
    })
    pays: string;

    @ApiProperty({
        description: "Code postal du prestataire",
        example: "75001",
    })
    code_postal: string;

    @ApiProperty({
        description: "Numéro de téléphone du prestataire (optionnel)",
        example: "+33 1 23 45 67 89",
        required: false,
    })
    telephone?: string;

    @ApiProperty({
        description: "Adresse email du prestataire",
        example: "contact@entreprisedupont.com",
    })
    email: string;

    @ApiProperty({
        description: "Indique si le prestataire est actif ou non",
        example: true,
    })
    est_active: boolean;
}
