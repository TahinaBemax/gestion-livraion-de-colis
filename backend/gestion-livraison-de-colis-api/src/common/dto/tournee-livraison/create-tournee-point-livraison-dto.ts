import { ApiProperty } from "@nestjs/swagger";
import { IsArray, IsNotEmpty } from "class-validator";

export class TourneePointLivraisonDto {
    @IsArray()
    @IsNotEmpty()
    @ApiProperty({example: [2, 4, 1]})
    id_points_livraison: number[];
}