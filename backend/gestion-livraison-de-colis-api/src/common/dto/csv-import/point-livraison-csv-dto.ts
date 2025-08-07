import { IsNotEmpty, IsNumber, IsNumberString, IsOptional } from "class-validator";

export class PointLivraisonCsvDto {
    @IsNotEmpty()
    numero_magasin: string;

    @IsNotEmpty()
    nom_rue?: string;

    @IsNotEmpty()
    departement: string;

    @IsNotEmpty()
    ville: string;

    @IsNotEmpty()
    pays: string;

    @IsNumberString()
    @IsNotEmpty()
    latitude: number;
    
    @IsNumberString()
    @IsNotEmpty()
    longitude: number;

    @IsNumberString()
    code_postal: string;

    @IsNotEmpty()
    complement_adresse?: string;

    @IsOptional()
    @IsNotEmpty()
    nom_prestataire?: string;
}