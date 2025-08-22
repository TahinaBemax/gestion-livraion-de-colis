import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsNumber } from "class-validator";
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
    @IsNotEmpty()
    @ApiProperty()
    id_livreur: number;
}