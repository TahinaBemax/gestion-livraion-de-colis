import { Column, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn, Unique } from "typeorm";
import { DetailColisEntity } from "./detail-colis.entity";
import { ProblemeColisEntity } from "./probleme-colis.entity";
import { LivraisonEntity } from "../livraisons/livraison.entity";

@Entity("colis")
@Unique(["code_barre_client_colis"])
export class ColisEntity{
    @PrimaryGeneratedColumn({name: "id_colis"})
    id: number;
    
    @Column()
    code_barre_client_colis: string;
    
    @Column()
    poids_total: number;

    @Column({"type": "timestamptz"})
    date_heure_chargement: Date;

    @Column({"type": "timestamptz"})
    date_heure_dechargement: Date;

    @Column({"type": "timestamptz"})
    date_heure_accuse_reception: Date;

    @Column({"type": "timestamptz"})
    date_heure_retour_expediteur: Date;
    
    @Column()
    statut_colis: string;

    @OneToMany(() => DetailColisEntity, (d) => d.colis, {
        eager: true, 
        cascade: ["insert"]
    })
    details_colis: DetailColisEntity[];

    @OneToMany(() => ProblemeColisEntity, (d) => d.colis, {
        eager: true,
    })
    problemes: ProblemeColisEntity[];

    @ManyToOne(() => LivraisonEntity, (l) => l.colis)
    @JoinColumn({name: "id_livraison", referencedColumnName: "id"})
    livraisons: LivraisonEntity;
}