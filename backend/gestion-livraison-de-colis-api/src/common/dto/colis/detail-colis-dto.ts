import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsNumber, IsOptional } from "class-validator";

export class DetailColisDto{
    @IsNotEmpty()
    @ApiProperty({required: false})
    @IsOptional()
    id?: number;
    
    @IsNotEmpty()
    @ApiProperty()
    description:string;

    @IsNotEmpty()
    @ApiProperty()
    @IsNumber()
    poids:number;
    
    @IsNotEmpty()
    @IsNumber()
    @ApiProperty()
    valeur_declaree: number;    
}