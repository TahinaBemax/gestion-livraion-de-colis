import { IsNotEmpty, IsNumber, IsOptional } from "class-validator";

export class PointLivraisonCreateDto {
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

    @IsNumber()
    latitude: number;
    
    @IsNumber()
    longitude: number;

    @IsNotEmpty()
    code_postal: string;

    complement_adresse?: string;

    @IsOptional()
    prestataire?: number;
    
    @IsOptional()
    contraintes_livraison?: number[];
    
    @IsOptional()
    animations_ville?: number[];
}