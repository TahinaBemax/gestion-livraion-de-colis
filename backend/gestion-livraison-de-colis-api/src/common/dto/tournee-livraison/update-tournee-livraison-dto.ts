import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsNumber, IsOptional } from "class-validator";
import { IsFRDate } from "src/common/validators/is-fr-date";
import { IsTime } from "src/common/validators/is-time.validator";

export class TourneeLivraisonUpdateDto {
    @IsFRDate()
    @IsNotEmpty()
    @ApiProperty({required: false})
    @IsOptional()
    date_tournee?: string;
    
    @IsNotEmpty()
    @IsOptional()
    @IsTime()
    @ApiProperty({required: false})
    heure_debut?: string;
    
    @IsOptional()
    @IsNotEmpty()
    @IsTime()
    @ApiProperty({required: false})
    heure_fin?: string;
        
    @IsNumber()
    @IsOptional()
    @ApiProperty({ required: false})
    id_livreur?: number;
}