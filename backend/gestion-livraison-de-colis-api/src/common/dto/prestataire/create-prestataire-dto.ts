import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsNotEmpty, IsPhoneNumber } from "class-validator";
import { DefaulPrestataireAdminUserDto } from "./default-user-prestataire-dto";

export class PrestataireCreateDto {
    @ApiProperty({
        description: "Utilisateur admin par default Prestataire",
        type: () => DefaulPrestataireAdminUserDto
    })
    user: DefaulPrestataireAdminUserDto;

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
    adresse_principale: string;

    @ApiProperty({
        description: "Numéro de téléphone du prestataire (optionnel)",
        example: "+33 1 23 45 67 89",
    })
    @IsPhoneNumber()
    numero_telephone: string;

    @ApiProperty({
        description: "Adresse email du prestataire",
        example: "contact@entreprisedupont.com",
    })
    @IsNotEmpty()
    @IsEmail()
    adresse_email: string;

    @IsNotEmpty()
    @ApiProperty({
        description: "Chemin du logo de l'entreprise du prestataire",
        example: "images/logos/entreprise_dupont_logo.png",
    })
    nom_image_logo: string;
}