import { ApiProperty } from "@nestjs/swagger";
import { IsEnum, IsNotEmpty, IsNumber, IsOptional } from "class-validator";
import { FrequenceEvenementEnum } from "src/common/enum/frequence-evenement.enum";
import { JourSemaine } from "src/common/enum/jour-semaine.enum";
import { TypeEvenementEnum } from "src/common/enum/type-evenement.enum";
import { IsFRDate } from "src/common/validators/is-fr-date";


export class EvenementLocalDto {
    @IsOptional()
    @IsNumber()
    @ApiProperty({example: 1})
    id?: number;
    
    @IsNotEmpty()
    @ApiProperty({example: "Fête de l'indepadance"})
    nom_evenement: string;

    @ApiProperty({example: "Fête de l'indepadance"})
    @IsOptional()
    @IsEnum(JourSemaine)
    jour_semaine: string;
    
    @IsFRDate()
    @ApiProperty({example: "25/06/2025"})
    date_debut: string;
    
    @IsFRDate()
    @ApiProperty({example: "25/06/2025"})
    date_fin: string;
    
    @IsEnum(TypeEvenementEnum)
    @IsNotEmpty()
    type_evenement: string;
    
    @IsEnum(FrequenceEvenementEnum)
    @IsNotEmpty()
    frequence_evenement: string; 
}