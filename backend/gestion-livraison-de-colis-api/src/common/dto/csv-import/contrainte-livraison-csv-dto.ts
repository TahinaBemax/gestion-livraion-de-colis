import { IsNotEmpty } from "class-validator";
import { IsFRDate } from "src/common/validators/is-fr-date";
import { IsTime } from "src/common/validators/is-time.validator";

export class ContrainteLivraisonCsvDto {
    @IsNotEmpty()
    intitule_contrainte: string;

    @IsFRDate()
    date_contrainte: string;

    @IsTime()
    heure_debut: string;

    @IsTime()
    heure_fin: string;

    @IsNotEmpty()
    nom_point_livraison:string
}