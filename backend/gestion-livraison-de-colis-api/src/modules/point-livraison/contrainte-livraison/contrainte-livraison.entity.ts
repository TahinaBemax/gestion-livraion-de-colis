import { Column, Entity, JoinColumn, OneToMany, OneToOne, PrimaryGeneratedColumn, Timestamp, Unique } from "typeorm";
import { PointLivraison } from "../point-livraison.entity";
import { ContrainteJourLivraison } from "../contrainte-jour-livraison/contrainte-jour-livraison.entity";

@Entity("contraintes_livraison")
@Unique(["intutile_contrainte"])
export class ContrainteLivraison {
    @PrimaryGeneratedColumn()
    id_contrainte_livraison: number;

    @Column()
    intutile_contrainte: string;

    @Column()
    heure_debut: Date;

    @Column()
    heure_fin: Date;

    @Column()
    date_debut: Date;

    @Column()
    date_fin: Date;

    @Column()
    latitude: string;

    @Column()
    priorite_contrainte: string;

    @OneToOne(() => PointLivraison)
    @JoinColumn({name: "id_point_livraison"})
    point_livraison?: PointLivraison;

    @OneToMany(() => ContrainteJourLivraison, (contrainte) => contrainte.contrainte_livraison)
    @JoinColumn({name: "id_contrainte_jour_livraison"})
    contrainte_jour_livraisons?: ContrainteJourLivraison[];
}