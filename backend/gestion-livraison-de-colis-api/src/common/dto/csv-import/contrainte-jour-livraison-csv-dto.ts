import { IsNotEmpty, IsString } from "class-validator";
import { IsBooleanOrBooleanString } from "src/common/validators/is-boolean-or-boolean-string.validator";
import { IsTime } from "src/common/validators/is-time.validator";

export class ContrainteJourLivraisonCsvDto {
    @IsNotEmpty()
    @IsString()
    jour: string;

    @IsBooleanOrBooleanString()
    @IsNotEmpty()
    est_livrable: boolean;

    @IsNotEmpty()
    @IsTime()
    heure_debut: string;

    @IsNotEmpty()
    @IsTime()
    heure_fin: string;

    @IsNotEmpty()
    intitule_contrainte:string
}