import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsNumber, IsOptional } from "class-validator";
import { IsFRDate } from "src/common/validators/is-fr-date";
import { IsTime } from "src/common/validators/is-time.validator";

export class TourneeLivraisonCreateDto {
    @IsFRDate()
    @IsNotEmpty()
    @ApiProperty()
    date_tournee: string;
    
    @IsNotEmpty()
    @IsTime()
    @ApiProperty()
    heure_debut: string;
    
    @IsNotEmpty()
    @IsTime()
    @ApiProperty()
    heure_fin: string;
        
    @IsNumber()
    @IsOptional()
    @ApiProperty({ required: false})
    id_livreur?: number;

    @IsNumber()
    @IsNotEmpty()
    @ApiProperty()
    id_prestatiare: number;
}