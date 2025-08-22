import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { TourneeLivraisonEntity } from "../tournee-livraison/tournee-livraison.entity";

@Entity("plannings_livraison")
export class PlanningLivraisonEntity {
    @PrimaryGeneratedColumn({name: "id_planning_livraison"})
    id: number;

    @Column({type: "date"})
    date_debut: string;
    
    @Column({type: "date"})
    date_fin: string;
    
    @Column()
    priorite_livraison: string;

    @Column()
    statut: string;

    @OneToMany(() => TourneeLivraisonEntity, (t) => t.planning_livraison, {
        eager: true,
        onDelete: "CASCADE"
    })
    tournees_livraison: TourneeLivraisonEntity[]
}