import { ApiProperty } from "@nestjs/swagger";
import { IsArray, IsNotEmpty, IsOptional } from "class-validator";
import { IsFRDate } from "src/common/validators/is-fr-date";

export class BordereauLivraisonCreateDto {
    @IsOptional()
    @IsFRDate()
    @ApiProperty({ 
        example: '25/12/2023', 
        description: 'Date du bordereau de livraison au format JJ/MM/AAAA',
        required: false 
    })
    date_bordereau?: string;
    
    // @IsNotEmpty()
    // @IsFRDate()
    // @ApiProperty({ 
    //     example: '25/12/2023', 
    //     description: 'Date du bordereau de livraison au format JJ/MM/AAAA' 
    // })
    // date_livraison: string;
    
    @IsNotEmpty()
    @IsArray()
    @ApiProperty({ example: [1, 2], description: '' })
    id_ordre_livraison: number[];
}