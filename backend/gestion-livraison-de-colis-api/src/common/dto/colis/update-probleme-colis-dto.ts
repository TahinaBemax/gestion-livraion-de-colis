import { IsNotEmpty, IsNumber, IsOptional } from "class-validator";

export class ProblemeColisUpdateDto {
    @IsNotEmpty()
    @IsNumber()
    id: number;

    @IsNotEmpty()
    titre: string;

    @IsOptional()
    description?: string;
}