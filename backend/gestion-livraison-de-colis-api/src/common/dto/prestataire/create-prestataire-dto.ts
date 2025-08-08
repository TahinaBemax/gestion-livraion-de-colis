import { ApiProperty } from "@nestjs/swagger";
import { IsBoolean, IsEmail, IsNotEmpty, IsOptional, IsPhoneNumber, IsPostalCode, IsString, Matches } from "class-validator";

export class PrestataireCreateDto {
    @ApiProperty({
        description: "Nom de l'entreprise du prestataire",
        example: "Entreprise Dupont",
    })
    @IsNotEmpty()
    nom_entreprise: string;

    @ApiProperty({
        description: "Numéro d'identification fiscale du prestataire (optionnel)",
        example: "123456789",
        required: true,
    })
    @IsNotEmpty()
    nif: string;

    @ApiProperty({
        description: "Numéro de statut du prestataire (optionnel)",
        example: "123-4567890",
    })
    @IsNotEmpty()
    stat: string;

    @ApiProperty({
        description: "Première ligne d'adresse du prestataire",
        example: "123 Rue de Paris",
    })
    @IsNotEmpty()
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
    @IsOptional()
    departement?: string;

    @ApiProperty({
        description: "État ou province du prestataire (optionnel)",
        example: "Île-de-France",
        required: false,
    })
    @IsOptional()
    etat?: string;

    @ApiProperty({
        description: "Ville où se situe le prestataire",
        example: "Paris",
    })
    @IsNotEmpty()
    ville: string;

    @ApiProperty({
        description: "Pays où se situe le prestataire",
        example: "France",
    })
    @IsNotEmpty()
    pays: string;

    @ApiProperty({
        description: "Code postal du prestataire",
        example: "75001",
    })
    @IsNotEmpty()
    @Matches(/^\d+$/, { message: 'Le code postal doit contenir uniquement des chiffres.' })
    code_postal: string;

    @ApiProperty({
        description: "Numéro de téléphone du prestataire (optionnel)",
        example: "+33 1 23 45 67 89",
        required: false,
    })
    @IsOptional()
    @IsPhoneNumber()
    telephone?: string;

    @ApiProperty({
        description: "Adresse email du prestataire",
        example: "contact@entreprisedupont.com",
    })
    @IsNotEmpty()
    @IsEmail()
    email: string;

    @ApiProperty({
        description: "Indique si le prestataire est actif ou non",
        example: true,
    })
    @IsBoolean()
    @IsNotEmpty()
    est_active: boolean;
}