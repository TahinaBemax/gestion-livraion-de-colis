import { IsEnum, IsNotEmpty, IsNumber, IsOptional } from "class-validator";
import { IsFRDate } from "src/common/validators/is-fr-date";
import { ContrainteAnimationVilleDto } from "../contrainte-animation-ville/contrainte-animation-ville-dto";
import { Transform } from "class-transformer";
import { ApiProperty } from "@nestjs/swagger";
import { FrequenceEvenementEnum } from "src/common/enum/frequence-evenement.enum";
import { JourSemaine } from "src/common/enum/jour-semaine.enum";
import { TypeEvenementEnum } from "src/common/enum/type-evenement.enum";

export class UpdateEvenementLocalDto {
    @IsNumber()
    @Transform(({value}) => {
        return (value) ? parseInt(value) : value;
    })
    @ApiProperty({example: 1})
    id: number;
    
    
    @IsNotEmpty()
    @ApiProperty({example: "Fête de l'indepadance"})
    nom_evenement: string;

    @ApiProperty({example: "Fête de l'indepadance"})
    @IsOptional()
    @IsEnum(JourSemaine)
    jour_semaine?: string;
    
    @IsFRDate()
    @ApiProperty({example: "25/06/2025"})
    date_debut: string;
    
    @IsFRDate()
    @ApiProperty({example: "25/06/2025"})
    date_fin: string;
    
    @IsEnum(TypeEvenementEnum)
    @IsNotEmpty()
    type: string;
    
    @IsEnum(FrequenceEvenementEnum)
    @IsNotEmpty()
    frequence: string;

    @IsOptional()
    @ApiProperty({example: "{'id_contrainte_animation_ville': null, 2, 3}, 'id_point_livraison': 1, 'id_animation_ville': 3 ",
         required: false, type: [ContrainteAnimationVilleDto]
    })
    contraintes_animations_villes?: ContrainteAnimationVilleDto[];
}