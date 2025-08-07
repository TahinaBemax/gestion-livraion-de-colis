import { IsNotEmpty, IsNumber } from "class-validator";
import { IsFRDate } from "src/common/validators/is-fr-date";
import { IsTime } from "src/common/validators/is-time.validator";

export class ContrainteLivraisonCsvDto {
    @IsNotEmpty()
    intitule_contrainte: string;

    @IsNotEmpty()
    @IsTime()
    heure_debut?: string;

    @IsNotEmpty()
    @IsTime()
    heure_fin: string;

    @IsFRDate()
    date_debut: Date;

    @IsFRDate()
    date_fin: Date;

    @IsNotEmpty()
    priorite_contrainte?: number;

    @IsNotEmpty()
    numero_magasin:string
}