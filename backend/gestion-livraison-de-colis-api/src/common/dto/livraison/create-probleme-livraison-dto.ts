import { IsNotEmpty, IsOptional } from "class-validator";

export class ProblemeLivraisonCreateDto {
    @IsNotEmpty()
    titre: string;

    @IsOptional()
    description?: string;
}