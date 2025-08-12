import { ApiProperty } from "@nestjs/swagger";
import { Transform } from "class-transformer";
import { IsNotEmpty, IsNumber, IsNumberString, IsOptional } from "class-validator";

export class ContrainteAnimationVilleDto {
    @IsOptional()
    @IsNumber()
    @IsNotEmpty()
    @Transform(({value}) => {
        return (value) ? parseInt(value) : value;
    })
    @ApiProperty({example: 1})
    id_contrainte_animation_ville?:number;

    @IsNumber()
    @IsNotEmpty()
    @Transform(({value}) => {
        return (value) ? parseInt(value) : value;
    })
    @ApiProperty({example: 1})
    id_point_livraison:number;

    @IsNumber()
    @IsNotEmpty()
    @Transform(({value}) => {
        return (value) ? parseInt(value) : value;
    })
    @ApiProperty({example: 1})
    id_animation_ville:number;
}