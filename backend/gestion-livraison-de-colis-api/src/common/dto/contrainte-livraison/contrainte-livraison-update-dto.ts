import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsOptional } from "class-validator";
import { IsFRDate } from "src/common/validators/is-fr-date";

export class ContrainteLivraisonUpdateDto {
    @IsNotEmpty()
    @ApiProperty({
        required: false
    })
    intitule_contrainte?: string;
    
    @IsFRDate()
    @IsNotEmpty()
    @ApiProperty({
        required: false,
        description: "La date doit être en format dd/MM/yyyy"
    })
    date_contrainte?: string;
    
    @IsOptional()
    @IsNotEmpty()
    @ApiProperty({
        required: false,
        example: "Urgent",
    })
    priorite_contrainte?: string;
}