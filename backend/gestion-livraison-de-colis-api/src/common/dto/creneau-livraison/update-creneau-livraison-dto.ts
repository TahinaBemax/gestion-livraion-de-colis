import { IsNotEmpty, IsNumber, IsOptional, IsString } from "class-validator";
import { JourSemaine } from "src/common/enum/jour-semaine.enum";
import { IsTime } from "src/common/validators/is-time.validator";

export class UpdateCreneauLivraisonDto {
    @IsNotEmpty()
    @IsNumber()
    id: number;

    @IsOptional()
    @IsString()
    jour_semaine?: JourSemaine;

    @IsOptional()
    @IsTime()
    heure_debut?: string;

    @IsOptional()
    @IsTime()
    heure_fin?: string;

    @IsOptional()
    @IsNumber()
    annee?: number;

    @IsOptional()
    @IsNumber()
    id_point_livraison?: number;
}
