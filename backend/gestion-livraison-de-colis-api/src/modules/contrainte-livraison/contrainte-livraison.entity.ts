import { Entity, PrimaryGeneratedColumn, Column, OneToOne, JoinColumn, OneToMany, ManyToOne } from "typeorm";
import { PointLivraisonEntity } from "../point-livraison/point-livraison.entity";
import { ContrainteJourEntity } from "../contrainte-jour/contrainte-jour.entity";

@Entity("contraintes_livraisons")
export class ContrainteLivraisonEntity {
    @PrimaryGeneratedColumn({name: "id_contrainte_livraison"})
    id: number;

    @Column()
    intitule_contrainte: string;

    @Column({type: "date"})
    date_debut: Date;

    @Column({type: "date"})
    date_fin: Date;

    @Column()
    priorite_contrainte: string;

    @ManyToOne(() => PointLivraisonEntity, (pl) => pl.contraintes_livraison)
    @JoinColumn({name: "id_point_livraison", referencedColumnName: "id"})
    point_livraison?: PointLivraisonEntity;

    @OneToMany(() => ContrainteJourEntity, (contrainte) => contrainte.contrainte_livraison, {
        eager: true, 
        cascade: true, 
        onUpdate: "CASCADE"
    })
    contrainte_jour_livraisons?: ContrainteJourEntity[];
}