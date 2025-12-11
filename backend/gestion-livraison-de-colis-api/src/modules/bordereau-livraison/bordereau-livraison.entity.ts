import { Column, Entity, JoinColumn, ManyToOne, OneToOne, PrimaryColumn } from "typeorm";
import { OrdreLivraisonEntity } from "../ordre-livraison/ordre-livraison.entity";

@Entity("bordereaux_livraison")
export class BordereauLivraisonEntity {
    @PrimaryColumn({name: "ref_bordereau_livraison"})
    id: string;

    @Column({type: "text"})
    nom_expediteur: string;
    
    @Column({type: "text"})
    adresse_expediteur: string;
    
    @Column({type: "text"})
    contact_expediteur: string;

    @Column({type: "text"})
    nom_destinataire: string;
    
    @Column({type: "text"})
    adresse_destinataire: string;
    
    @Column({type: "text"})
    contact_destinataire: string;

    @Column({type: "date"})
    date_bordereau: string;

    @Column({ type: "timestamptz", nullable: true })
    date_scan_bordereau: Date;

    @Column({ type: "timestamptz", nullable: true })
    date_preuve_livraison: Date;

    @Column({type: "date"})
    date_livraison: string;
    
    @ManyToOne(() => OrdreLivraisonEntity, (ordre) => ordre.bordereau_livraison, {
        eager: true
    })
    @JoinColumn({name: "id_ordre_livraison", referencedColumnName: "id"})
    ordre_livraison: OrdreLivraisonEntity;
}
