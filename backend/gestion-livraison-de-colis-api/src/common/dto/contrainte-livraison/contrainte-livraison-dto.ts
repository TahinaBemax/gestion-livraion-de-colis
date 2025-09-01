import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsNumber, IsOptional } from "class-validator";
import { IsFRDate } from "src/common/validators/is-fr-date";

export class ContrainteLivraisonDto {
    @IsOptional()
    @IsNumber()
    @ApiProperty({
        example: 1, 
        required: false
    })
    id?: number;

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
    date_debut: string;
    
    @IsNotEmpty()
    @IsFRDate()
    @ApiProperty({
        example: "11/08/2025",
        description: "La date doit être en format dd/MM/yyyy"
    })
    date_fin: string;
    
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
        required: false
    })
    id_point_livraison?: number;
}