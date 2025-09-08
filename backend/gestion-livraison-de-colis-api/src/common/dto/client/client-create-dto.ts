import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsNotEmpty, IsNumber, IsOptional } from "class-validator";
import { IsPhoneNumber } from "src/common/validators/is-phone-number";

export class ClientCreateDto {
    @IsNotEmpty()
    @ApiProperty()
    nom_client: string;
    
    @IsNotEmpty()
    @ApiProperty()
    prenom_client: string;
    
    @IsNotEmpty()
    @IsOptional()
    @ApiProperty({ required: false })
    civilite?: string;
    
    @IsNotEmpty()
    @ApiProperty()
    @IsPhoneNumber()
    numero_telephone: string;
    
    @IsNotEmpty()
    @ApiProperty()
    @IsEmail()
    adresse_mail: string; 

    @IsNumber()
    @ApiProperty()
    id_point_livraison: number;    
}