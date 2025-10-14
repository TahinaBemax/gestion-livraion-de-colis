import { IsInt, IsNotEmpty } from "class-validator";

export class AlertFromPrestataireToTempoOneDto {
    @IsNotEmpty()
    titreProbleme: string; // Type de problème (ex: "Retard", "Colis endommagé")

    @IsNotEmpty()
    description: string; // Description du problème

    @IsNotEmpty()
    idPrestataire: number; // ID du prestataire à notifier

    @IsInt()
    idUtilisateur: number; // ID de l'utilisateur Tempo One concerné
}