import { Column, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn, Unique } from "typeorm";
import { DetailColisEntity } from "./detail-colis.entity";
import { ProblemeColisEntity } from "./probleme-colis.entity";
import { LivraisonEntity } from "../livraisons/livraison.entity";

@Entity("colis")
@Unique(["code_barre_colis", "code_barre_client_colis"])
export class ColisEntity{
    @PrimaryGeneratedColumn({name: "id_colis"})
    id: number;
    
    @Column()
    code_barre_colis: string;
    
    @Column()
    code_barre_client_colis: string;
    
    @Column()
    poids_total: number;

    @Column({"type": "timestamp"})
    date_heure_chargement: string;

    @Column({"type": "timestamp"})
    date_heure_dechargement: string;

    @Column({"type": "timestamp"})
    date_heure_accuse_reception: string;

    @Column({"type": "timestamp"})
    date_heure_retour_expediteur: string;
    
    @Column()
    statut_colis: string;

    @OneToMany(() => DetailColisEntity, (d) => d.colis, {
        eager: true, 
        cascade: true, 
        onUpdate: "CASCADE"
    })
    details_colis: DetailColisEntity[];

    @OneToMany(() => ProblemeColisEntity, (d) => d.colis, {
        eager: true,
    })
    problemes: ProblemeColisEntity[];

    @ManyToOne(() => LivraisonEntity, (l) => l.colis)
    @JoinColumn({name: "id_livraison", referencedColumnName: "id"})
    livraisons: LivraisonEntity[];
}