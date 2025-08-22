import { BordereauLivraisonEntity } from './../bordereau-livraison/bordereau-livraison.entity';
import { TourneeLivraisonEntity } from './../tournee-livraison/tournee-livraison.entity';
import { Column, Entity, JoinColumn, JoinTable, ManyToMany, ManyToOne, OneToOne, PrimaryGeneratedColumn } from "typeorm";
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
    nbr_colis_prevu: number;
    
    @Column()
    nbr_colis_reel: number;

    @ManyToOne(() => TourneeLivraisonEntity, (t) => t.ordres_livraison)
    @JoinColumn({referencedColumnName: "id", name: "id_tournee"})
    tournee_livraison: TourneeLivraisonEntity;

    @ManyToMany(() => LivraisonEntity, (l) => l.ordres_livraison, {
        eager: true,
    })
    livraisons: LivraisonEntity[];

    @OneToOne(() => BordereauLivraisonEntity, (b) => b.ordre_livraison, {
        onDelete: "CASCADE"
    })
    bordereau_livraison: BordereauLivraisonEntity;

    @ManyToOne(() => PointLivraisonEntity, (p) => p.ordres_livraison, {eager: true})
    @JoinColumn({name: "id_point_livraison", referencedColumnName: "id"})
    point_livraison: PointLivraisonEntity;    
}