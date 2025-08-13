import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { PointLivraisonEntity } from "../point-livraison/point-livraison.entity";

@Entity("creneaux_livraison")
export class CreneauLivraisonEntity {
    @PrimaryGeneratedColumn()
    id_creneau_horaire: number;

    @Column()
    jour_semaine: string;

    @Column({type: "time"})
    heure_debut: string;

    @Column({type: "time"})
    heure_fin: string;

    @Column()
    annee: number;

    @ManyToOne(() => PointLivraisonEntity)
    @JoinColumn({name: "creneaux_livraison"})
    point_livraison: PointLivraisonEntity;
}