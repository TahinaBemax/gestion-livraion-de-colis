import { IsEnum, IsNotEmpty, IsString } from "class-validator";
import { ConvertEmptyToUndefined } from "src/common/decorators/convert-empty-to-undefined.decorator";
import { Jours } from "src/common/enum/jours.enum";
import { IsBooleanOrBooleanString } from "src/common/validators/is-boolean-or-boolean-string.validator";
import { IsTime } from "src/common/validators/is-time.validator";

export class ContrainteJourLivraisonCsvDto {
    @IsNotEmpty()
    @IsString()
    @IsEnum(Jours)
    jour: string;

    @IsBooleanOrBooleanString()
    @IsNotEmpty()
    est_livrable: boolean;

    @ConvertEmptyToUndefined()
    @IsTime()
    heure_debut: string;
    
    @ConvertEmptyToUndefined()
    @IsTime()
    heure_fin: string;

    @IsNotEmpty()
    intitule_contrainte:string
}