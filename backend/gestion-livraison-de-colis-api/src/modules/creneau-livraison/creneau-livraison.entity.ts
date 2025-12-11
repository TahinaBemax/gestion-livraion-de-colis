import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { PointLivraisonEntity } from "../point-livraison/point-livraison.entity";

@Entity("creneaux_livraison")
export class CreneauLivraisonEntity {
    @PrimaryGeneratedColumn({ name: "id_creneau_horaire" })
    id: number;

    @Column()
    jour_semaine: string;

    @Column({ type: "time" })
    heure_debut: string;

    @Column({ type: "time" })
    heure_fin: string;

    @Column()
    annee: number;

    @ManyToOne(() => PointLivraisonEntity, { onDelete: "CASCADE" })
    @JoinColumn({ name: "id_point_livraison", referencedColumnName: "id" })
    point_livraison: PointLivraisonEntity;
}