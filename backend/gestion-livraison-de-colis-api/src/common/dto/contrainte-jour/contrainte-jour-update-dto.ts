import { ApiProperty } from "@nestjs/swagger";
import { IsBoolean, IsEnum,IsOptional } from "class-validator";
import { JourSemaine } from "src/common/enum/jour-semaine.enum";
import { IsTime } from "src/common/validators/is-time.validator";

export class ContrainteJourUpdateDto {
    @IsEnum(JourSemaine)
    @ApiProperty({example: "Lundi", required: false})
    jour_semaine?:string;
    
    @IsBoolean()
    @IsOptional()
    @ApiProperty({example: true, required: false})
    est_livrable?: boolean;
    
    @IsTime()
    @IsOptional()
    @ApiProperty({example: "08:00", required: false})
    heure_debut_livraison?: string;
    
    @IsTime()
    @IsOptional()
    @ApiProperty({example: "18:00", required: false})
    heure_fin_livraison?: string;
}