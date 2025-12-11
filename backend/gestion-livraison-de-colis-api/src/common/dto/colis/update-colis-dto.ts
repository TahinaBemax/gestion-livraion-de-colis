import { ApiProperty } from "@nestjs/swagger";
import { IsEnum, IsNotEmpty, IsNumber } from "class-validator";
import { StatusColis } from "src/common/enum/status-colis.enum";

export class ColisUpdateDto{
    @IsNotEmpty()
    @ApiProperty({required: false})
    @IsEnum(StatusColis)
    status?:string;
    
    @IsNotEmpty()
    @ApiProperty({required: false})
    description_produit?:string;

    @IsNotEmpty()
    @ApiProperty({required: false})
    @IsNumber()
    poids_produit?:number;
    
    @IsNotEmpty()
    @IsNumber()
    @ApiProperty({required: false})
    valeur_produit?: number;   
}