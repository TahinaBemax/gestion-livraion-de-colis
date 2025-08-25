import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsNumber, IsOptional } from "class-validator";

export class DetailColisUpdateDto{
    @IsNotEmpty()
    @ApiProperty()
    @IsNumber()
    id: number;
    
    @IsNotEmpty()
    @ApiProperty()
    description_produit:string;

    @IsNotEmpty()
    @ApiProperty()
    @IsNumber()
    poids_produit:number;
    
    @IsNotEmpty()
    @IsNumber()
    @ApiProperty()
    valeur_produit: number;    
}