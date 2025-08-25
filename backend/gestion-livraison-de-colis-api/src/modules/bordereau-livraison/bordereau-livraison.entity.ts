import { Column, Entity, JoinColumn, JoinTable, ManyToMany, ManyToOne, OneToMany, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { Livreur } from "../livreur/livreur.entity";
import { OrdreLivraisonEntity } from "../ordre-livraison/ordre-livraison.entity";
import { DetailColisEntity } from "../colis/detail-colis.entity";

@Entity("bordereaux_livraison")
export class BordereauLivraisonEntity {
    @PrimaryGeneratedColumn({name: "id_bordereau_livraison"})
    id: number;

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

    @Column({type: "date"})
    date_livraison: string;

    @ManyToMany(() => DetailColisEntity, (dc) => dc.bordereaux_livraison, {
        cascade: true
    })
    @JoinTable({
        name: "contenu_livraison",
        joinColumn: {
            name: "id_bordereau_livraison",
            referencedColumnName: "id"
        },
        inverseJoinColumn: {
            name: "ref_prouit",
            referencedColumnName: "id"
        }
    })
    contenu: DetailColisEntity[];
    
    @OneToOne(() => OrdreLivraisonEntity)
    ordre_livraison: OrdreLivraisonEntity;

    @ManyToOne(() => Livreur, (l) => l.bordereaux_livraison)
    @JoinColumn({name: "id_livreur"})
    livreur: Livreur;
}