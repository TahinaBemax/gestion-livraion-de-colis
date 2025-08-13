import { IsNotEmpty, IsNumber, IsOptional, IsString } from "class-validator";
import { JourSemaine } from "src/common/enum/jour-semaine.enum";
import { IsTime } from "src/common/validators/is-time.validator";

export class CreateCreneauLivraisonDto {
    @IsOptional()
    @IsNumber()
    id?: number;

    @IsNotEmpty()
    @IsString()
    jour_semaine: JourSemaine;

    @IsNotEmpty()
    @IsTime()
    heure_debut: string;

    @IsNotEmpty()
    @IsTime()
    heure_fin: string;

    @IsNotEmpty()
    @IsNumber()
    annee: number;

    @IsNotEmpty()
    @IsNumber()
    id_point_livraison: number;
}
