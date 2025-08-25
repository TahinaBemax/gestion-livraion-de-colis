import { ApiProperty } from "@nestjs/swagger";
import { IsNumber, IsOptional } from "class-validator";
import { IsFRDate } from "src/common/validators/is-fr-date";
import { IsTime } from "src/common/validators/is-time.validator";

export class LivraisonUpdateDto {
    @ApiProperty({description: "Une petite note"})
    @IsOptional()
    notes?: string;
    
    @ApiProperty({example: "12/05/2025"})
    @IsFRDate()
    @IsOptional()
    date_livraison?: string;
    
    @ApiProperty({example: "10:20:00"})
    @IsTime()
    @IsOptional()
    heure_debut?: string;
    
    @ApiProperty({example: "14:00:00"})
    @IsTime()
    @IsOptional()
    heure_fin?: string;
    
    @ApiProperty({example: "Avenue, RN7"})
    @IsOptional()
    rue?: string;
    
    @ApiProperty({example: "Antananarivo"})
    @IsOptional()
    ville?: string;
    
    @ApiProperty({example: "Madagascar"})
    @IsOptional()
    pays?: string;
    
    @ApiProperty({example: "BII 101"})
    @IsOptional()
    code_postal?: string;
    
    @IsOptional()
    @IsNumber()
    @ApiProperty({example: 1})
    id_point_livraison?: number;
}