import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsNumber } from "class-validator";
import { IsFRDate } from "src/common/validators/is-fr-date";
import { IsTime } from "src/common/validators/is-time.validator";

export class LivraisonUpdateDto {
    @ApiProperty()
    notes: string;

    @IsFRDate()
    @ApiProperty()
    date_livraison: string;

    @IsNotEmpty()
    @ApiProperty()
    @IsTime()
    heure_debut: string;
    
    @IsTime()
    @IsNotEmpty()
    @ApiProperty()
    heure_fin: string; 
    
    @IsNotEmpty()
    @IsNumber()
    @ApiProperty()
    id_point_livraison: number;
}