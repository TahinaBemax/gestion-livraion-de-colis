import { IsBoolean, IsEmail, IsNotEmpty, IsOptional, IsPhoneNumber, IsPostalCode, IsString, Matches } from "class-validator";

export class PrestataireCreateDto {
    @IsNotEmpty()
    nom_entreprise: string;

    @IsNotEmpty()
    nif: string;

    @IsNotEmpty()
    stat: string;

    @IsNotEmpty()
    adresse1: string;

    adresse2?: string;

    @IsOptional()
    departement?: string;

    @IsOptional()
    etat?: string;

    @IsNotEmpty()
    ville: string;

    @IsNotEmpty()
    pays: string;

    @IsNotEmpty()
    @Matches(/^\d+$/, { message: 'Le code postal doit contenir uniquement des chiffres.' })
    code_postal: string;

    @IsOptional()
    @IsPhoneNumber()
    telephone?: string;

    @IsNotEmpty()
    @IsEmail()
    email: string;

    @IsBoolean()
    @IsNotEmpty()
    est_active: boolean;
}