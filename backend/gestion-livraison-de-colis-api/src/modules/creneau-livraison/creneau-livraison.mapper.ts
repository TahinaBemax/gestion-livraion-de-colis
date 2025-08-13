import { CreneauLivraisonEntity } from './creneau-livraison.entity';
import { CreneauLivraisonResponseDto } from 'src/common/dto/creneau-livraison/creneau-livraison-response-dto';

export class CreneauLivraisonMapper {
    static toResponseDto(entity: CreneauLivraisonEntity): CreneauLivraisonResponseDto {
        return {
            id: entity.id,
            jour_semaine: entity.jour_semaine,
            heure_debut: entity.heure_debut,
            heure_fin: entity.heure_fin,
            annee: entity.annee,
            point_livraison: entity.point_livraison ? {
                id: entity.point_livraison.id,
                numero_magasin: entity.point_livraison.numero_magasin,
                ville: entity.point_livraison.ville,
                departement: entity.point_livraison.departement
            } : undefined
        };
    }

    static toResponseDtoList(entities: CreneauLivraisonEntity[]): CreneauLivraisonResponseDto[] {
        return entities.map(entity => this.toResponseDto(entity));
    }
}
