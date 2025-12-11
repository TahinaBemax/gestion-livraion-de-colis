import { IsInt, IsNotEmpty } from "class-validator";

export class AlertProblemeColisDto {
    @IsNotEmpty()
    titreProbleme: string; // Type de problème (ex: "Retard", "Colis endommagé")

    @IsNotEmpty()
    description: string; // Description du problème

    @IsNotEmpty()
    idLivreur: number; // ID du livreur signalant le problème

    @IsNotEmpty()
    idPrestataire: number; // ID du prestataire à notifier

    @IsInt()
    idColis: number; // ID du colis concerné
}