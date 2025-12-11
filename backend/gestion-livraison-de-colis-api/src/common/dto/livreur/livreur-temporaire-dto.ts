import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsStrongPassword } from "class-validator";
import { IsFRDate } from "src/common/validators/is-fr-date";
import { IsPhoneNumber } from "src/common/validators/is-phone-number";

export class LivreurTemporaireDto{
    @IsNotEmpty()
    @ApiProperty({example: "Rakoto"})
    nom:string;
    
    @IsNotEmpty()
    @ApiProperty({example: "Jean"})
    prenom:string;
    
    @IsFRDate()
    @ApiProperty({example: "01/01/1990"})
    date_naissance: string;
    
    @IsPhoneNumber()
    @ApiProperty({example: "0330011122"})
    telephone: string;
    
    @IsStrongPassword()
    @ApiProperty({example: "Mot2Passe!"})
    mot_de_passe: string;
}