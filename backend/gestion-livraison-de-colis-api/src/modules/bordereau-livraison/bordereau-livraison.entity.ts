import { Column, Entity, JoinColumn, ManyToOne, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { Livreur } from "../livreur/livreur.entity";
import { OrdreLivraisonEntity } from "../ordre-livraison/ordre-livraison.entity";

@Entity("bordereaux_livraison")
export class BordereauLivraisonEntity {
    @PrimaryGeneratedColumn({name: "id_bordereau_livraison"})
    id: number;

    @Column({type: "date"})
    date_creation: string;
    
    @OneToOne(() => OrdreLivraisonEntity)
    ordre_livraison: OrdreLivraisonEntity;

    @ManyToOne(() => Livreur, (l) => l.bordereaux_livraison)
    @JoinColumn({name: "id_livreur"})
    livreur: Livreur;
}