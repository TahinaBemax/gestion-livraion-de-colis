import { Column, Entity, JoinColumn, JoinTable, ManyToMany, ManyToOne, OneToOne, PrimaryColumn } from "typeorm";
import { Livreur } from "../livreur/livreur.entity";
import { OrdreLivraisonEntity } from "../ordre-livraison/ordre-livraison.entity";
import { DetailColisEntity } from "../colis/detail-colis.entity";

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

    @Column({ type: "timestamp", nullable: true })
    date_scan_bordereau: string;

    @Column({type: "date"})
    date_livraison: string;

    @ManyToMany(() => DetailColisEntity, (dc) => dc.bordereaux_livraison, {
        eager: true
    })
    @JoinTable({
        name: "contenu_livraison", joinColumn: { name: "ref_bordereau_livraison", referencedColumnName: "id" },
        inverseJoinColumn: { name: "ref_produit", referencedColumnName: "id" }
    })
    contenu: DetailColisEntity[];
    
    @OneToOne(() => OrdreLivraisonEntity, (ordre) => ordre.bordereau_livraison, {
        eager: true
    })
    @JoinColumn({name: "id_ordre_livraison", referencedColumnName: "id"})
    ordre_livraison: OrdreLivraisonEntity;

    @ManyToOne(() => Livreur, (l) => l.bordereaux_livraison, {
        eager: true
    })
    @JoinColumn({name: "id_livreur"})
    livreur: Livreur;
}
