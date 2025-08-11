import { PointLivraisonSwaggerDto } from 'src/common/swagger-dto/point-livraison/point-livraison-swagger-dto';
import { ApiProperty } from "@nestjs/swagger";
import { ContrainteJourLivraisonSwaggerDto } from '../contrainte-jour-livraison/contrainte-jour-livraison-swagger-dto';

export class ContrainteLivraisonSwaggerDto {
    @ApiProperty({
        example: 123,
    })
    id_contrainte_livraison: number;

    @ApiProperty({
        example: "Livraison Weekend impossible",
    })
    intitule_contrainte: string;

    @ApiProperty({
        required: false,
        example: "04:23",
    })
    heure_debut?: string;
    
    @ApiProperty({
        required: false,
        example: "14:23",
    })
    heure_fin?: string;

    @ApiProperty({
        example: "11/08/2025",
    })
    date_debut: Date;
    
    @ApiProperty({
        example: "11/08/2025",
    })
    date_fin: Date;
    
    @ApiProperty({
        required: false,
        example: "Urgent",
    })
    priorite_contrainte?: string;
    
    @ApiProperty({
        type: PointLivraisonSwaggerDto,
        example: {},
    })
    point_livraison: PointLivraisonSwaggerDto;
    
    @ApiProperty({
        type: ContrainteJourLivraisonSwaggerDto,
        example: [{}],
    })
    contraintes_jour_livraison?: ContrainteJourLivraisonSwaggerDto[];
}