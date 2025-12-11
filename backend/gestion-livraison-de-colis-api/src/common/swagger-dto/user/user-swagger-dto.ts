import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsEmail, IsPhoneNumber, IsBoolean, IsOptional } from 'class-validator';
import { Role } from 'src/modules/role/role.entity';
import { PrestataireSwaggerDto } from '../prestataire/prestataire-swagger-dto';
import { TypeUtilisateurSwaggerDto } from '../type-utilisateur/type-utilisateur-swagger-dto';


export class UserSwaggerDto {

    @ApiProperty({
        description: "Identifiant unique de l'utilisateur (optionnel)",
        example: 123,
        required: false,
    })
    id_utilisateur?: number;

    @ApiProperty({
        description: "Nom de l'utilisateur",
        example: "Dupont",
    })
    @IsNotEmpty()
    nom: string;

    @ApiProperty({
        description: "Prénom de l'utilisateur",
        example: "Jean",
    })
    @IsNotEmpty()
    prenom: string;

    @ApiProperty({
        description: "Civilité de l'utilisateur (ex: Monsieur, Madame)",
        example: "Monsieur",
    })
    @IsNotEmpty()
    civilite: string;

    @ApiProperty({
        description: "Date de naissance de l'utilisateur",
        example: "1985-04-15T00:00:00.000Z",
    })
    @IsNotEmpty()
    date_naissance: Date;

    @ApiProperty({
        description: "Numéro de téléphone de l'utilisateur (optionnel)",
        example: "+33 6 12 34 56 78",
        required: false,
    })
    @IsPhoneNumber()
    @IsOptional()
    telephone?: string;

    @ApiProperty({
        description: "Adresse email de l'utilisateur",
        example: "jean.dupont@example.com",
    })
    @IsEmail()
    @IsNotEmpty()
    email: string;

    @ApiProperty({
        description: "Nom d'utilisateur pour la connexion",
        example: "jdupont",
    })
    @IsNotEmpty()
    login: string;

    @ApiProperty({
        description: "Mot de passe sécurisé de l'utilisateur",
        example: "MotDePasse123!",
    })
    @IsNotEmpty()
    mot_de_passe: string;

    @ApiProperty({
        description: "Indique si l'utilisateur est actif ou non",
        example: true,
    })
    @IsBoolean()
    est_active: boolean;

    @ApiProperty({
        description: "Photo de profil de l'utilisateur (optionnel)",
        example: "https://example.com/photo.jpg",
        required: false,
    })
    @IsOptional()
    photo_profil?: string;

    @ApiProperty({
        description: "Rôle de l'utilisateur (ex: Admin, Utilisateur)",
        type: Role,
        example: "Admin",
    })
    role: Role;

    @ApiProperty({
        description: "Type d'utilisateur (ex: Professionnel, Particulier)",
        example: "Professionnel",
        type: TypeUtilisateurSwaggerDto
    })
    type_utilisateur: TypeUtilisateurSwaggerDto;

    @ApiProperty({
        description: "Détails du prestataire associé à l'utilisateur (optionnel)",
        example: {},
        type: PrestataireSwaggerDto,
        required: false,
    })
    prestataire?: PrestataireSwaggerDto;
}
