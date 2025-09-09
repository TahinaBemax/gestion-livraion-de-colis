import { ApiProperty } from "@nestjs/swagger";
import { IsBoolean, IsEnum,IsNotEmpty, IsNumber } from "class-validator";
import { JourSemaine } from "src/common/enum/jour-semaine.enum";
import { IsTime } from "src/common/validators/is-time.validator";

export class ContrainteJourDto {
    @IsEnum(JourSemaine)
    @IsNotEmpty()
    @ApiProperty({example: "Lundi"})
    jour_semaine:string;
    
    @IsBoolean()
    @ApiProperty({example: true})
    est_livrable: boolean;
    
    @IsTime()
    @ApiProperty({example: "08:00"})
    heure_debut_livraison: string;
    
    @IsTime()
    @ApiProperty({example: "18:00"})
    heure_fin_livraison: string;
}