import { IsNotEmpty, IsNumberString, IsOptional } from "class-validator";

export class PointLivraisonCsvDto {
    @IsNotEmpty()
    nom_point_livraison: string;

    @IsNotEmpty()
    nom_rue: string;

    @IsNotEmpty()
    numero_rue: string;

    @IsOptional()
    departement?: string;

    @IsNotEmpty()
    ville: string;

    @IsOptional()
    pays?: string;

    @IsNumberString()
    @IsOptional()
    latitude?: number;
    
    @IsNumberString()
    @IsOptional()
    longitude?: number;

    @IsNumberString()
    code_postal: string;

    @IsOptional()
    complement_adresse?: string;

    @IsOptional()
    @IsNotEmpty()
    nom_prestataire?: string;
}