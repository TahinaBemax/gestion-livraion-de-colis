import { ApiProperty } from "@nestjs/swagger";

export class CategorieLivreurSwaggerDto{
    @ApiProperty({example: "CAT-LIVREUR-00001"})
    id_categorie_livreur: string;
    
    @ApiProperty({example: "Novice"})
    categorie_livreur: string;
}