import { IsNotEmpty, IsOptional } from "class-validator";

export class ProblemeColisCreateDto {
    @IsNotEmpty()
    titre: string;

    @IsOptional()
    description?: string;
}