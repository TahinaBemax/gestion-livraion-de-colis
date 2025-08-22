import { Column, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { Livreur } from "../livreur/livreur.entity";
import { PlanningLivraisonEntity } from "../planning-livraison/planning-livraison.entity";
import { OrdreLivraisonEntity } from "../ordre-livraison/ordre-livraison.entity";

@Entity("tournees_livraison")
export class TourneeLivraisonEntity {
    @PrimaryGeneratedColumn({name: "id_tournee"})
    id: number;

    @Column({type: "date"})
    date_tournee: string;

    @Column({type: "time"})
    heure_debut: string;

    @Column({type: "time"})
    heure_fin: string;

    @Column()
    statut: string;

    @ManyToOne(() => Livreur, (l) => l.tournees_livraison, {
        eager: true
    })
    @JoinColumn({name: "id_livreur"})
    livreur: Livreur;
    
    @ManyToOne(() => PlanningLivraisonEntity, (p) => p.tournees_livraison, {eager: false})
    @JoinColumn({name: "id_planning_livraison", referencedColumnName: "id"})
    planning_livraison: PlanningLivraisonEntity;

    @OneToMany(() => OrdreLivraisonEntity, (o) => o.tournee_livraison, {
        eager: true,
        onDelete: "CASCADE"
    })
    ordres_livraison: OrdreLivraisonEntity[];
}