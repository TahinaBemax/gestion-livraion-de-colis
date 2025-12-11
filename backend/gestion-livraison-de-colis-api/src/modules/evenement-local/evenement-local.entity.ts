import { Column, Entity, ManyToMany, PrimaryGeneratedColumn } from "typeorm";
import { PointLivraisonEntity } from "../point-livraison/point-livraison.entity";

@Entity("evenements_locaux")
export class EvenementLocalEntity {
    @PrimaryGeneratedColumn({name: "id_evenement"})
    id: number;

    @Column()
    nom_evenement: string;

    @Column()
    jour_semaine: string;

    @Column({type: 'date'})
    date_debut: string;

    @Column({type: 'date'})
    date_fin: string;

    @Column()
    type_evenement: string;

    @Column()
    frequence_evenement: string; 
    
    @ManyToMany(() => PointLivraisonEntity, (pl) => pl.evenements)
    points_livraison: PointLivraisonEntity[];
}