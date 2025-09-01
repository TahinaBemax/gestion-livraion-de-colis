import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsNumber, IsNumberString, IsOptional } from "class-validator";

export class CreatePointLivraisonDto {
    @IsOptional()
    @IsNumber()
    @ApiProperty({required: false})
    id?: number;
    
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
    @ApiProperty({required: false})
    departement?: string;
    
    @IsNotEmpty()
    @ApiProperty()
    ville: string;
    
    @IsNotEmpty()
    @IsOptional()
    @ApiProperty({required: false})
    pays?: string;
    
    @IsNumber()
    @IsOptional()
    @ApiProperty({required: false})
    latitude?: number;
    
    @IsNumber()
    @IsOptional()
    @ApiProperty({required: false})
    @ApiProperty({required: false})
    longitude?: number;
    
    @IsNotEmpty()
    @IsNumberString()
    @ApiProperty()
    code_postal: string;
    
    @IsOptional()
    @IsOptional()
    @ApiProperty({required: false})
    complement_adresse?: string;
}