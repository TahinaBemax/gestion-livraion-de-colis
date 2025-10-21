import { IsNotEmpty } from "class-validator";
import { IsFRDate } from "src/common/validators/is-fr-date";
import { IsTime } from "src/common/validators/is-time.validator";

export class ContrainteLivraisonCsvDto {
    @IsNotEmpty()
    intitule_contrainte: string;

    @IsFRDate()
    date_contrainte: string;

    @IsTime()
    heure_debut_livrable: string;

    @IsTime()
    heure_fin_livrable: string;

    @IsNotEmpty()
    nom_point_livraison:string
}