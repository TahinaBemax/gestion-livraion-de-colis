import { IsInt, IsNotEmpty } from "class-validator";
import { IsTime } from "src/common/validators/is-time.validator";

export class AlertProblemeLivraisonDto {
    @IsNotEmpty()
    titreProbleme: string; // Type de problème (ex: "Retard", "Colis endommagé")

    @IsNotEmpty()
    description: string; // Description du problème

    @IsNotEmpty()
    idLivreur: number; // ID du livreur signalant le problème

    @IsNotEmpty()
    idPrestataire: number; // ID du prestataire à notifier

    @IsInt()
    idLivraison: number; // ID du livraison concerné

    @IsTime()
    estimationRestard: string
}