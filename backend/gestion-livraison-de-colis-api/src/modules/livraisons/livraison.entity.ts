import { Column, Entity, JoinColumn, ManyToOne, OneToMany, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { ColisEntity } from "../colis/colis.entity";
import { PointLivraisonEntity } from "../point-livraison/point-livraison.entity";
import { ProblemeLivraisonEntity } from "./probleme-livraison.entity";

@Entity("livraisons")
export class LivraisonEntity {
    @PrimaryGeneratedColumn({name: "id_livraison"})
    id: number; 

    @Column()
    notes: string;

    @Column({type: "date"})
    date_livraison: Date;
    
    @Column({type: "time"})
    heure_debut: string;
    
    @Column({type: "time"})
    heure_fin: string;
    
    @Column()
    rue: string;

    @Column()
    ville: string;
    
    @Column()
    pays: string;

    @Column()
    code_postal: string;
    
    @Column()
    status: string;

    @ManyToOne(() => ColisEntity, (c) => c.livraisons, {
        eager: true
    })
    @JoinColumn({name: "id_colis", referencedColumnName: "id"})
    colis: ColisEntity;

    @OneToOne(() => PointLivraisonEntity, (p) => p.livraisons, {
        eager: true
    })
    @JoinColumn({name: "id_point_livraison", referencedColumnName: "id"})
    point_livraison: PointLivraisonEntity;

    @OneToMany(() => ProblemeLivraisonEntity, (p) => p.livraison, {
        eager: true
    })
    problemes_livraison: ProblemeLivraisonEntity[];
}