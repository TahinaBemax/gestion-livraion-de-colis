import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsOptional, IsStrongPassword } from "class-validator";
import { IsFRDate } from "src/common/validators/is-fr-date";
import { IsPhoneNumber } from "src/common/validators/is-phone-number";

export class LivreurTemporaireUpdateDto{
    @IsOptional()
    @IsNotEmpty()
    @ApiProperty({
        example: "Rakoto",
        required: false
    })
    nom?:string;
    
    @IsOptional()
    @IsNotEmpty()
    @ApiProperty({
        example: "Jean",
        required: false
    })
    prenom?:string;
    
    @IsOptional()
    @IsFRDate()
    @ApiProperty({
        example: "01/01/1990",
        required: false
    })
    date_naissance?: string;
    
    @IsOptional()
    @IsPhoneNumber()
    @ApiProperty({
        example: "0330011122",
        required: false
    })
    telephone?: string;
    
    @IsOptional()
    @IsStrongPassword()
    @ApiProperty({
        example: "Mot2Passe!",
        required: false
    })
    mot_de_passe?: string;
}