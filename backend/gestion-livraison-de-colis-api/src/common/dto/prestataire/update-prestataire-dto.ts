import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsNotEmpty, IsOptional, IsPhoneNumber, Matches } from "class-validator";

export class PrestataireUpdateDto {
    @ApiProperty({
        description: "Nom de l'entreprise du prestataire",
        example: "Entreprise Dupont",
    })
    @IsNotEmpty()
    @IsOptional()
    nom_entreprise?: string;

    @ApiProperty({
        description: "Numéro d'identification fiscale du prestataire (optionnel)",
        example: "123456789",
        required: true,
    })
    @IsOptional()
    @IsNotEmpty()
    nif?: string;
    
    @ApiProperty({
        description: "Numéro de statut du prestataire (optionnel)",
        example: "123-4567890",
    })
    @IsOptional()
    @IsNotEmpty()
    stat?: string;
    
    @ApiProperty({
        description: "Première ligne d'adresse du prestataire",
        example: "123 Rue de Paris",
    })
    @IsOptional()
    @IsNotEmpty()
    adresse_principale?: string;
    
    @ApiProperty({
        description: "Deuxième ligne d'adresse du prestataire (optionnel)",
        example: "Appartement 45",
        required: false,
    })    
    @IsOptional()
    adresse_complementaire?: string;
    
    @ApiProperty({
        description: "Nom du département du prestataire",
        example: "Ile-de-France",
    })
    @IsNotEmpty()
    @IsOptional()
    departement?: string;
    
    @ApiProperty({
        description: "État ou province du prestataire (optionnel)",
        example: "Île-de-France",
        required: false,
    })
    @IsNotEmpty()
    @IsOptional()
    etat?: string;
    
    @ApiProperty({
        description: "Ville où se situe le prestataire",
        example: "Paris",
    })
    @IsOptional()
    @IsNotEmpty()
    ville?: string;
    
    @ApiProperty({
        description: "Pays où se situe le prestataire",
        example: "France",
    })
    @IsOptional()
    @IsNotEmpty()
    pays?: string;
    
    @ApiProperty({
        description: "Code postal du prestataire",
        example: "75001",
    })
    @IsOptional()
    @IsNotEmpty()
    @Matches(/^\d+$/, { message: 'Le code postal doit contenir uniquement des chiffres.' })
    code_postal?: string;
    
    @ApiProperty({
        description: "Numéro de téléphone du prestataire (optionnel)",
        example: "+33 1 23 45 67 89",
    })
    @IsOptional()
    @IsPhoneNumber()
    numero_telephone?: string;
    
    @ApiProperty({
        description: "Adresse email du prestataire",
        example: "contact@entreprisedupont.com",
    })
    @IsOptional()
    @IsNotEmpty()
    @IsEmail()
    adresse_email?: string;
    
    @IsNotEmpty()
    @IsOptional()
    nom_image_logo?: string;
}