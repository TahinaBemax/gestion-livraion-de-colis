import { Column, Entity, JoinColumn, OneToMany, OneToOne, PrimaryGeneratedColumn, Timestamp, Unique } from "typeorm";
import { PointLivraison } from "../point-livraison.entity";
import { ContrainteJourLivraison } from "../contrainte-jour-livraison/contrainte-jour-livraison.entity";

@Entity("contraintes_livraison")
@Unique(["intitule_contrainte"])
export class ContrainteLivraison {
    @PrimaryGeneratedColumn()
    id_contrainte_livraison: number;

    @Column()
    intitule_contrainte: string;

    @Column()
    heure_debut: string;

    @Column()
    heure_fin: string;

    @Column()
    date_debut: Date;

    @Column()
    date_fin: Date;

    @Column()
    priorite_contrainte: string;

    @OneToOne(() => PointLivraison)
    @JoinColumn({name: "id_point_livraison"})
    point_livraison?: PointLivraison;

    @OneToMany(() => ContrainteJourLivraison, (contrainte) => contrainte.contrainte_livraison, {eager: true, cascade: true, onUpdate: "CASCADE"})
    @JoinColumn({name: "id_contrainte_jour_livraison"})
    contrainte_jour_livraisons?: ContrainteJourLivraison[];
}