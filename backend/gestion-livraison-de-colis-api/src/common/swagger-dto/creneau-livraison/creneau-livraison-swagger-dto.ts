import { ApiProperty } from '@nestjs/swagger';
import { JourSemaine } from 'src/common/enum/jour-semaine.enum';
import { PointLivraisonSwaggerDto } from '../point-livraison/point-livraison-swagger-dto';

export class CreneauLivraisonSwaggerDto {
    @ApiProperty({ description: 'ID unique du créneau horaire', example: 1 })
    id: number;

    @ApiProperty({ 
        description: 'Jour de la semaine', 
        enum: JourSemaine,
        example: JourSemaine.LUNDI 
    })
    jour_semaine: JourSemaine;

    @ApiProperty({ 
        description: 'Heure de début du créneau', 
        example: '08:00:00',
        format: 'time'
    })
    heure_debut: string;

    @ApiProperty({ 
        description: 'Heure de fin du créneau', 
        example: '12:00:00',
        format: 'time'
    })
    heure_fin: string;

    @ApiProperty({ 
        description: 'Année du créneau', 
        example: 2024 
    })
    annee: number;

    @ApiProperty({ 
        description: "ID du point de livraison associé", 
        example: 1 
    })
    id_point_livraison: number;

    @ApiProperty({
        description: "Point de livraison associé",
        required: false,
        type: PointLivraisonSwaggerDto
    })
    point_livraison?: any;
}
