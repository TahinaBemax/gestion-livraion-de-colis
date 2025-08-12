import { ApiProperty } from "@nestjs/swagger";
import { IsArray, IsNotEmpty, IsNumber, IsOptional } from "class-validator";
import { ConvertEmptyToUndefined } from "src/common/decorators/convert-empty-to-undefined.decorator";
import { IsFRDate } from "src/common/validators/is-fr-date";
import { IsTime } from "src/common/validators/is-time.validator";

export class AnimationVilleDto {
    @IsOptional()
    @IsNumber()
    @ApiProperty({example: 1})
    id_animation_ville?: number;
    
    @IsNotEmpty()
    @ApiProperty({example: "Fête de l'indepadance"})
    intitule_animation: string;
    
    @IsFRDate()
    @ApiProperty({example: "25/06/2025"})
    date_debut: string;
    
    @IsFRDate()
    @ApiProperty({example: "25/06/2025"})
    date_fin: string;
    
    @IsOptional()
    @IsTime()
    @ConvertEmptyToUndefined()
    @ApiProperty({example: "00:00", required: false})
    heure_debut?: string;
    
    @IsOptional()
    @IsTime()
    @ConvertEmptyToUndefined()
    @ApiProperty({example: "23:59", required: false})
    heure_fin?: string;
    
    @IsOptional()
    @IsArray()
    @ApiProperty({example: "[1, 2, 3]", required: false})
    point_livraison?: number[];
}