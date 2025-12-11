import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsEmail, IsEnum, IsStrongPassword } from 'class-validator';
import { UserRole } from '../enum/user-role.enum';

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
        description: "Adresse email de l'utilisateur",
        example: "jean.dupont@example.com",
    })
    @IsNotEmpty()
    @IsEmail()
    email: string;

    @ApiProperty({
        description: "Mot de passe sécurisé de l'utilisateur",
        example: "MotDePasse123!",
    })
    @IsNotEmpty()
    @IsStrongPassword()
    mot_de_passe: string;

    @ApiProperty({
        description: "Rôle de l'utilisateur (ex: Admin, Utilisateur, Responsable Exploitation)",
        example: "ROLE-01",
    })
    @IsEnum(UserRole)
    role: string;
}
