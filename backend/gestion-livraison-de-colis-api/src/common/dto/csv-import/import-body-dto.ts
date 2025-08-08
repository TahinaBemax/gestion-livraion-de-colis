import { ApiProperty } from "@nestjs/swagger";

export class ImportBodyDto {
    @ApiProperty({example: "point_livraison.csv"})
    point_livraison_fichier: Express.Multer.File[];
    @ApiProperty({example: "contrainte_livraison.csv"})
    contrainte_livraison_fichier?: Express.Multer.File[];
    @ApiProperty({example: "contrainte_jour_livraison.csv"})
    contrainte_jour_livraison_fichier?: Express.Multer.File[];
}