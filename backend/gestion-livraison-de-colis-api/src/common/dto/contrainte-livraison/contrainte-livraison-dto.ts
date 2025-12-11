import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsNumber, IsOptional } from "class-validator";
import { IsFRDate } from "src/common/validators/is-fr-date";
import { IsTime } from "src/common/validators/is-time.validator";

export class ContrainteLivraisonDto {
    @IsNotEmpty()
    @ApiProperty({
        example: "Livraison Weekend impossible",
    })
    intitule_contrainte: string;

    @IsFRDate()
    @IsNotEmpty()
    @ApiProperty({
        example: "11/08/2025",
        description: "La date doit être en format dd/MM/yyyy"
    })
    date_contrainte: string;

    @IsNotEmpty()
    @IsTime()
    @ApiProperty({
        example: "08:00:00",
    })
    heure_debut_livrrable: string;
    
    @IsNotEmpty()
    @IsTime()
    @ApiProperty({
        example: "18:00:00",
    })
    heure_fin_livrrable: string;
}