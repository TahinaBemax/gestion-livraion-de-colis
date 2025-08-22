import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsNumber } from "class-validator";
import { IsTime } from "src/common/validators/is-time.validator";

export class OrdreLivraisonUpdateDto {
    @IsNumber()
    @ApiProperty()
    point_obtenu:number;
    
    @IsTime()
    @ApiProperty()
    estimation_retard: string;
    
    @IsNumber()
    @ApiProperty()
    nbr_colis_prevu: number;
    
    @IsNumber()
    @ApiProperty()
    nbr_colis_reel: number;
    
    @IsNotEmpty()
    @IsNumber()
    @ApiProperty({type: [Number], example: [1, 2]})
    id_livraisons: number[];
}