import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsNumber, IsNumberString, IsOptional } from "class-validator";
import { ContrainteLivraisonDto } from "../contrainte-livraison/contrainte-livraison-dto";

export class PointLivraisonUpdateDto {    
    @IsNotEmpty()
    @ApiProperty({
        required: false
    })
    numero_magasin?: string;
    
    @IsNotEmpty()
    @ApiProperty({
        required: false
    })
    nom_rue?: string;
    
    @IsNotEmpty()
    @ApiProperty({
        required: false
    })
    numero_rue?: string;
    
    @IsNotEmpty()
    @IsOptional()
    @ApiProperty({
        required: false
    })
    departement?: string;
    
    @IsNotEmpty()
    @ApiProperty({
        required: false
    })
    ville?: string;
    
    @IsNotEmpty()
    @IsOptional()
    @ApiProperty({
        required: false
    })
    pays?: string;

    
    @IsNumber()
    @IsOptional()
    @ApiProperty({
        required: false
    })
    latitude?: number;
    
    @IsNumber()
    @IsOptional()
    @ApiProperty({
        required: false
    })
    longitude?: number;
    
    @IsNotEmpty()
    @IsNumberString()
    @ApiProperty()
    code_postal: string;
    
    @IsOptional()
    @ApiProperty({
        required: false
    })
    complement_adresse?: string;
}