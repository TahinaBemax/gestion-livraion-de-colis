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
    departement: string;

    @IsNotEmpty()
    ville: string;

    @IsNotEmpty()
    pays: string;

    @IsNumber()
    latitude: number;
    
    @IsNumber()
    longitude: number;

    @IsNotEmpty()
    @IsNumberString()
    code_postal: string;

    @IsOptional()
    complement_adresse?: string;
}