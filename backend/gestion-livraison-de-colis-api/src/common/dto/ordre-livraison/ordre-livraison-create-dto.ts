import { ApiProperty } from "@nestjs/swagger";

export class OrdreLivraisonCreateDto {
    @ApiProperty({type: [Number]})
    id_livraisons: number[];
}