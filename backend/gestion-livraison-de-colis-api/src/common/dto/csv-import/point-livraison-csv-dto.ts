import { Transform } from "class-transformer";
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

    @IsOptional()
    @IsNumberString()
    @Transform(({ value }) => value === "" ? undefined : value)
    latitude?: number;
    
    @IsOptional()
    @IsNumberString()
    @Transform(({ value }) => value === "" ? undefined : value)
    longitude?: number;

    @IsNumberString()
    code_postal: string;

    @IsOptional()
    complement_adresse?: string;

    @IsOptional()
    @IsNotEmpty()
    nom_prestataire?: string;
}