import { ApiProperty } from "@nestjs/swagger";
import { IsString, IsNotEmpty } from "class-validator";

export class LoginDto {
    @ApiProperty({example: "admin@gmail.com", description: "Votre login"})
    @IsString()
    @IsNotEmpty()
    login:string;

    @IsString()
    @IsNotEmpty()
    @ApiProperty(
        {example: "AdminPassword!123", 
        description: "Votre mot de passe. Il doit contenir: chiffre, Lettre majuscule, miniscule et au moins un carractére spéciale"
    })
    mot_de_passe:string;
}