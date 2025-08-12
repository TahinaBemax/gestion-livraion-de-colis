import { IsNotEmpty, IsNumber, IsNumberString, IsOptional } from "class-validator";
import { ConvertEmptyToUndefined } from "src/common/decorators/convert-empty-to-undefined.decorator";
import { IsFRDate } from "src/common/validators/is-fr-date";
import { IsTime } from "src/common/validators/is-time.validator";
import { ContrainteAnimationVilleDto } from "../contrainte-animation-ville/contrainte-animation-ville-dto";
import { Transform } from "class-transformer";
import { ApiProperty } from "@nestjs/swagger";

export class UpdateAnimationVilleDto {
    @IsNumber()
    @Transform(({value}) => {
        return (value) ? parseInt(value) : value;
    })
    @ApiProperty({example: 1})
    id_animation_ville: number;
    
    @IsNotEmpty()
    @ApiProperty({example: "Fête de l'indepadance"})
    intitule_animation: string;
    
    @IsNotEmpty()
    @IsFRDate()
    @ApiProperty({example: "25/06/2025"})
    date_debut: string;
    
    @IsNotEmpty()
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
    @ApiProperty({example: "00:00", required: false})
    heure_fin?: string;

    @IsOptional()
    @ApiProperty({example: "{'id_contrainte_animation_ville': null, 2, 3}, 'id_point_livraison': 1, 'id_animation_ville': 3 ",
         required: false, type: [ContrainteAnimationVilleDto]
    })
    contraintes_animations_villes?: ContrainteAnimationVilleDto[];
}