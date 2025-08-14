import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsNumber, IsOptional, IsString } from "class-validator";
import { JourSemaine } from "src/common/enum/jour-semaine.enum";
import { IsTime } from "src/common/validators/is-time.validator";

export class CreateCreneauLivraisonDto {
    @IsOptional()
    @IsNumber()
    id?: number;

    @IsNotEmpty()
    @IsString()
    @ApiProperty({example: "Lundi"})
    jour_semaine: JourSemaine;
    
    @IsNotEmpty()
    @IsTime()
    @ApiProperty({example: "08:00"})
    heure_debut: string;
    
    @IsNotEmpty()
    @IsTime()
    @ApiProperty({example: "12:00"})
    heure_fin: string;
    
    @IsNotEmpty()
    @IsNumber()
    @ApiProperty({example: "2025"})
    annee: number;
    
    @IsNotEmpty()
    @IsNumber()
    @ApiProperty({example: 1})
    id_point_livraison: number;
}
