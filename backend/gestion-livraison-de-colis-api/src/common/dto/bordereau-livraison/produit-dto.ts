import { ApiProperty } from '@nestjs/swagger';


export class ProduitDto {
    @ApiProperty({
        description: 'Référence unique du produit',
        example: 'PROD12345',
    })
    ref_produit: string;

    @ApiProperty({
        description: 'Description détaillée du produit',
        example: 'Smartphone Samsung Galaxy S21',
    })
    description: string;

    @ApiProperty({
        description: 'Quantité du produit à livrer',
        example: 10,
        minimum: 1,
    })
    quantite: number;

    @ApiProperty({
        description: 'Poids total du produit en kilogrammes',
        example: 2.5,
        minimum: 0,
    })
    poids: number;

    @ApiProperty({
        description: 'Valeur totale du produit en Ariary',
        example: 1500000,
        minimum: 0,
    })
    valeur: number;
}