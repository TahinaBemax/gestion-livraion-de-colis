import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsEmail, IsPhoneNumber, IsStrongPassword } from 'class-validator';

export class DefaulPrestataireAdminUserDto {
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
        description: "Numéro de téléphone de l'utilisateur",
        example: "+261341234578",
    })
    @IsPhoneNumber()
    telephone: string;

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
}
