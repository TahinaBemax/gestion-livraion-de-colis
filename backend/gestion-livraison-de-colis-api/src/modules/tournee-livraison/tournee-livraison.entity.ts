import { Column, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { Livreur } from "../livreur/livreur.entity";
import { OrdreLivraisonEntity } from "../ordre-livraison/ordre-livraison.entity";
import { Prestataire } from "../prestataire/prestataire.entity";

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

    @ManyToOne(() => Prestataire, (p) => p.tournees_livraison, { eager: true })
    @JoinColumn({name: "id_prestataire", referencedColumnName: "id_prestataire"})
    prestataire: Prestataire;

    @OneToMany(() => OrdreLivraisonEntity, (o) => o.tournee_livraison, {
        eager: true,
        onDelete: "CASCADE"
    })
    ordres_livraison: OrdreLivraisonEntity[];
}