import { Entity, PrimaryGeneratedColumn, Column, JoinColumn, OneToMany, ManyToOne } from "typeorm";
import { PointLivraisonEntity } from "../point-livraison/point-livraison.entity";

@Entity("contraintes_livraison")
export class ContrainteLivraisonEntity {
    @PrimaryGeneratedColumn({name: "id_contrainte_livraison"})
    id: number;

    @Column()
    intitule_contrainte: string;

    @Column({type: "date"})
    date_contrainte: string;

    @Column({type: "time"})
    heure_fin_livrable: string;

    @Column({type: "time"})
    heure_debut_livrable: string;

    @ManyToOne(() => PointLivraisonEntity, (pl) => pl.contraintes_livraison)
    @JoinColumn({name: "id_point_livraison", referencedColumnName: "id"})
    point_livraison?: PointLivraisonEntity;
}