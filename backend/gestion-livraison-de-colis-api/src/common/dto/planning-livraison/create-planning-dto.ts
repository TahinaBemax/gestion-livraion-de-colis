import { ApiProperty } from "@nestjs/swagger";
import { IsEnum, IsNotEmpty } from "class-validator";
import { StatutsPrioriteLivraisonEnum } from "src/common/enum/priorite-planning-livraison";
import { IsFRDate } from "src/common/validators/is-fr-date";

export class PlanningLivraisonCreateDto {
    @IsFRDate()
    @IsNotEmpty()
    @ApiProperty()
    date_debut: string;
    
    @IsFRDate()
    @IsNotEmpty()
    @ApiProperty()
    date_fin: string;
    
    @IsNotEmpty()
    @IsEnum(StatutsPrioriteLivraisonEnum)
    @ApiProperty()
    priorite_livraison: string;
}