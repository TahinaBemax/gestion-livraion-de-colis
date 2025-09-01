import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsNumber, IsNumberString, IsOptional } from "class-validator";
import { ContrainteLivraisonDto } from "../contrainte-livraison/contrainte-livraison-dto";

export class CreatePointLivraisonDto {    
    @IsNotEmpty()
    @ApiProperty()
    numero_magasin: string;
    
    @IsNotEmpty()
    @ApiProperty()
    nom_rue: string;
    
    @IsNotEmpty()
    @ApiProperty()
    numero_rue: string;
    
    @IsNotEmpty()
    @IsOptional()
    @ApiProperty({
        required: false
    })
    departement?: string;
    
    @IsNotEmpty()
    @ApiProperty()
    ville: string;
    
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
    
    @IsOptional()
    @ApiProperty({
        required: false,
        type: [ContrainteLivraisonDto]
    })
    contraintes_livraison: ContrainteLivraisonDto[];
}