import { ApiProperty } from "@nestjs/swagger";
import { IsBoolean, IsEnum, IsNotEmpty, IsNumber, IsOptional } from "class-validator";
import { JourSemaine } from "src/common/enum/jour-semaine.enum";
import { IsTime } from "src/common/validators/is-time.validator";

export class ContrainteJourDto {
    @IsOptional()
    @IsNumber()
    @ApiProperty({example: 1})
    id?: number;

    @IsEnum(JourSemaine)
    @ApiProperty({example: "Lundi"})
    jour:string;
    
    @IsBoolean()
    @IsNotEmpty()
    @ApiProperty({example: true})
    est_livrable: boolean;
    
    @IsTime()
    @IsNotEmpty()
    @ApiProperty({example: "08:00"})
    heure_debut: string;
    
    @IsTime()
    @IsNotEmpty()
    @ApiProperty({example: "18:00"})
    heure_fin: string;
    
    @IsNumber()
    @IsNotEmpty()
    @ApiProperty({example: 1})
    id_contrainte_livraison: number;
}