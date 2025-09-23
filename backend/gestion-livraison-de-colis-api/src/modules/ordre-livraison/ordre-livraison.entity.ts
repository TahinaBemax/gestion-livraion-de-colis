import { BordereauLivraisonEntity } from './../bordereau-livraison/bordereau-livraison.entity';
import { TourneeLivraisonEntity } from './../tournee-livraison/tournee-livraison.entity';
import { Column, Entity, JoinColumn, ManyToOne, OneToMany, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { LivraisonEntity } from "../livraisons/livraison.entity";
import { PointLivraisonEntity } from '../point-livraison/point-livraison.entity';

@Entity("ordres_livraison")
export class OrdreLivraisonEntity {
    @PrimaryGeneratedColumn({name: "id_ordre_livraison"})
    id: number;

    @Column()
    point_obtenu:number;
    
    @Column()
    estimation_retard: string;

    @Column()
    statut: string;
    
    @Column()
    nbr_colis_prevu: number;
    
    @Column()
    nbr_colis_reel: number;

    @ManyToOne(() => TourneeLivraisonEntity, (t) => t.ordres_livraison, {
        lazy: true
    })
    @JoinColumn({referencedColumnName: "id", name: "id_tournee"})
    tournee_livraison: Promise<TourneeLivraisonEntity>|TourneeLivraisonEntity;

    @OneToOne(() => LivraisonEntity, (l) => l.ordre_livraison, {
        eager: true,
    })
    @JoinColumn({ name: "id_livraison", referencedColumnName: "id" })
    livraison: LivraisonEntity;

    @OneToMany(() => BordereauLivraisonEntity, (b) => b.ordre_livraison, {
        lazy: true
    })
    bordereau_livraison: Promise<BordereauLivraisonEntity>|BordereauLivraisonEntity;

    @ManyToOne(() => PointLivraisonEntity, (p) => p.ordres_livraison, {
        eager: true
    })
    @JoinColumn({ name: "id_point_livraison", referencedColumnName: "id" })
    point_livraison: PointLivraisonEntity;    
}