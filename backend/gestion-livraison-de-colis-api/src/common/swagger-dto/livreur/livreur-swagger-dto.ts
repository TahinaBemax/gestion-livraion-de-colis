import { ApiProperty } from '@nestjs/swagger';
import { UserSwaggerDto } from '../user/user-swagger-dto';
import { CategorieLivreurSwaggerDto } from './categorie-livreur-swagger-dto';

export class LivreurSwaggerDto {
    @ApiProperty({
        description: "Identifiant unique du livreur",
        example: 123,
    })
    id_livreur: number;

    @ApiProperty({
        description: "Nombre total de points du livreur",
        example: 150,
    })
    total_points: number;

    @ApiProperty({
        description: "Rang global du livreur dans le classement",
        example: 5,
    })
    rang_global: number;

    @ApiProperty({
        description: "Indique si le livreur peut effectuer le chargement des colis",
        example: true,
    })
    peut_faire_chargement_colis: boolean;

    @ApiProperty({
        description: "QR code du livreur, utilisé pour identifier le livreur lors des livraisons",
        example: "QR_CODE_EXEMPLE_123456789",
    })
    qr_code: string;

    @ApiProperty({
        description: "Nombre total de livraisons effectuées par le livreur",
        example: 75,
    })
    total_livraison_effectue: number;

    @ApiProperty({
        description: "Catégorie du livreur (ex: Livreurs Premium, Livreurs Standards)",
        type: CategorieLivreurSwaggerDto, 
        example: { id_categorie: "CAT-LIVREUR-00001", nom_categorie: "Novice" },
    })
    categorie_livreur: CategorieLivreurSwaggerDto;

    @ApiProperty({
        description: "Informations sur l'utilisateur associé au livreur",
        type: UserSwaggerDto,
        example: { id_utilisateur: 123, nom: "Dupont", prenom: "Jean", email: "jean.dupont@example.com" }, // Example object
    })
    user: UserSwaggerDto;
}
