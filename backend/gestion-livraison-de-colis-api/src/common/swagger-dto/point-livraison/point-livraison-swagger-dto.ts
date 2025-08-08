import { ApiProperty } from "@nestjs/swagger";
import { PrestataireSwaggerDto } from "../prestataire/prestataire-swagger-dto";

export class PointLivraisonSwaggerDto{
    @ApiProperty()
    id_point_livraison: number;

    @ApiProperty()
    numero_magasin: string;

    @ApiProperty()
    nom_rue: string;

    @ApiProperty()
    departement: string;

    @ApiProperty()
    ville: string;

    @ApiProperty()
    pays: string;

    @ApiProperty()
    latitude: number;

    @ApiProperty()
    longitude: number;

    @ApiProperty()
    code_postal: string;

    @ApiProperty()
    complement_adresse: string;

    @ApiProperty()
    prestataire?: PrestataireSwaggerDto;

    @ApiProperty({
        required: false
    })
    contraintes_livraison?: number[];

    @ApiProperty({
        required:false
    })
    animations_ville?: number[];
}