import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsNotEmpty, IsOptional } from "class-validator";
import { IsPhoneNumber } from "src/common/validators/is-phone-number";

export class ClientUpdateDto {
    @IsNotEmpty()
    @ApiProperty({ required: false })
    nom_client?: string;
    
    @IsNotEmpty()
    @ApiProperty({ required: false })
    prenom_client?: string;
    
    @IsNotEmpty()
    @IsOptional()
    @ApiProperty({ required: false })
    civilite?: string;
    
    @IsNotEmpty()
    @ApiProperty({ required: false })
    @IsPhoneNumber()
    numero_telephone?: string;
    
    @IsNotEmpty()
    @ApiProperty({ required: false })
    @IsEmail()
    adresse_mail?: string;    
}