import { ApiProperty } from "@nestjs/swagger";

export class OrdreLivraisonCreateDto {
    @ApiProperty()
    id_livraisons: number[];
}