import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsNumber, IsOptional } from "class-validator";

export class DetailColisDto{
    @IsNotEmpty()
    @ApiProperty({required: false})
    @IsOptional()
    id?: number;
    
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