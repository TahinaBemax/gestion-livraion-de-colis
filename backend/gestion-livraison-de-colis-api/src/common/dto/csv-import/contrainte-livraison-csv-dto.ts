import { IsDate, IsDateString, IsNotEmpty, IsNumber } from "class-validator";
import { ConvertEmptyToUndefined } from "src/common/decorators/convert-empty-to-undefined.decorator";
import { IsFRDate } from "src/common/validators/is-fr-date";
import { IsTime } from "src/common/validators/is-time.validator";

export class ContrainteLivraisonCsvDto {
    @IsNotEmpty()
    intitule_contrainte: string;

    @IsFRDate()
    date_debut: string;

    @IsFRDate()
    date_fin: string;

    @IsNotEmpty()
    priorite_contrainte?: number;

    @IsNotEmpty()
    nom_point_livraison:string
}