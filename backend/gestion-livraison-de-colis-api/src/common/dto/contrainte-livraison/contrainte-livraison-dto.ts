import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsNumber, IsOptional } from "class-validator";
import { ConvertEmptyToUndefined } from "src/common/decorators/convert-empty-to-undefined.decorator";
import { IsFRDate } from "src/common/validators/is-fr-date";
import { IsTime } from "src/common/validators/is-time.validator";

export class ContrainteLivraisonDto {
    @IsNotEmpty()
    @ApiProperty({
        example: "Livraison Weekend impossible",
    })
    intitule_contrainte: string;

    @IsTime()
    @ConvertEmptyToUndefined()
    @ApiProperty({
        required: false,
        example: "04:23",
    })
    heure_debut?: string;
    
    @IsTime()
    @ConvertEmptyToUndefined()
    @ApiProperty({
        required: false,
        example: "14:23",
    })
    heure_fin?: string;

    @IsFRDate()
    @IsNotEmpty()
    @ApiProperty({
        example: "11/08/2025",
        description: "La date doit être en format dd/MM/yyyy"
    })
    date_debut: Date;
    
    @IsNotEmpty()
    @IsFRDate()
    @ApiProperty({
        example: "11/08/2025",
        description: "La date doit être en format dd/MM/yyyy"
    })
    date_fin: Date;
    
    @IsOptional()
    @IsNotEmpty()
    @ApiProperty({
        required: false,
        example: "Urgent",
    })
    priorite_contrainte?: string;
    
    @IsNotEmpty()
    @IsNumber()
    @ApiProperty({
        example: 1,
    })
    id_point_livraison: number;
    
    @IsOptional()
    @IsNumber()
    @ApiProperty({
        example: [1, 2, 3],
        required: false
    })
    id_contraintes_jour_livraison?: number[];
}