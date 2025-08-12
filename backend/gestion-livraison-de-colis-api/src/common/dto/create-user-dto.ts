import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsEmail, IsDateString, IsPhoneNumber, IsBoolean, IsEnum, IsOptional, IsStrongPassword } from 'class-validator';
import { TypeUtilisateur } from '../enum/type-utilisateur.enum';
import { UserRole } from '../enum/user-role.enum';
import { IsFRDate } from '../validators/is-fr-date';
import { IsImageFormat } from '../validators/is-image-format';

export class CreateUserDto {
  
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
    @IsNotEmpty({message: "La civilité est obligatoire. (Madame, Monsieur, etc.)"})
    civilite: string;

    @ApiProperty({
        description: "Date de naissance de l'utilisateur, format français (jj/mm/aaaa)",
        example: "15/04/1985",
    })
    @IsNotEmpty()
    @IsFRDate()
    date_naissance: string;

    @ApiProperty({
        description: "Numéro de téléphone de l'utilisateur",
        example: "+261341234578",
        required: false,
    })
    @IsPhoneNumber()
    telephone?: string;

    @ApiProperty({
        description: "Adresse email de l'utilisateur",
        example: "jean.dupont@example.com",
    })
    @IsNotEmpty()
    @IsEmail()
    email: string;

    @ApiProperty({
        description: "Nom d'utilisateur pour se connecter",
        example: "jdupont",
    })
    @IsNotEmpty()
    login: string;

    @ApiProperty({
        description: "Mot de passe sécurisé de l'utilisateur",
        example: "MotDePasse123!",
    })
    @IsNotEmpty()
    @IsStrongPassword()
    mot_de_passe: string;

    @ApiProperty({
        description: "Indique si l'utilisateur est actif ou non",
        example: true,
    })
    @IsBoolean()
    est_active: boolean;

    @ApiProperty({
        description: "Photo de profil de l'utilisateur (format image)",
        example: "https://example.com/photo.jpg",
        required: false,
    })
    @IsImageFormat()
    photo_profil?: string;

    @ApiProperty({
        description: "Rôle de l'utilisateur (ex: Admin, Utilisateur, Responsable Exploitation)",
        example: "ROLE-01",
    })
    @IsEnum(UserRole)
    role: string;

    @ApiProperty({
        description: "Type d'utilisateur (ex: Prestataire, Tempo One, Livreur)",
        example: "TYPE-USER-00001",
    })
    @IsEnum(TypeUtilisateur)
    type_utilisateur: string;

    @ApiProperty({
        description: "ID du prestataire si applicable",
        example: 1,
        required: false,
    })
    @IsOptional()
    prestataire?: number;
}
