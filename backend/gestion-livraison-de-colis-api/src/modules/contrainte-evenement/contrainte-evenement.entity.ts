import { PrimaryGeneratedColumn, ManyToOne, JoinColumn, Entity } from "typeorm";
import { EvenementLocalEntity } from "../evenement-local/evenement-local.entity";
import { PointLivraisonEntity } from "../point-livraison/point-livraison.entity";

@Entity("contraintes_evenement")
export class ContrainteEvenementEntity {
    @PrimaryGeneratedColumn({name: "id_contrainte_evenement"})
    id:number;

    @ManyToOne(() => PointLivraisonEntity,)
    @JoinColumn({name: "id_point_livraison", referencedColumnName: "id"})
    point_livraison:PointLivraisonEntity;

    @ManyToOne(() => EvenementLocalEntity,)
    @JoinColumn({name: "id_evenement", referencedColumnName: "id"})
    evenement_local: EvenementLocalEntity;
}