import { IsNotEmpty, IsNumber, IsNumberString, IsOptional } from "class-validator";

export class CreatePointLivraisonDto {
    @IsOptional()
    @IsNumber()
    id?: number;

    @IsNotEmpty()
    numero_magasin: string;

    @IsNotEmpty()
    nom_rue: string;

    @IsNotEmpty()
    numero_rue: string;

    @IsNotEmpty()
    @IsOptional()
    departement?: string;
    
    @IsNotEmpty()
    ville: string;
    
    @IsNotEmpty()
    @IsOptional()
    pays?: string;
    
    @IsNumber()
    @IsOptional()
    latitude?: number;
    
    @IsNumber()
    @IsOptional()
    longitude?: number;
    
    @IsNotEmpty()
    @IsNumberString()
    code_postal: string;
    
    @IsOptional()
    @IsOptional()
    complement_adresse?: string;
}