import { Column, Entity, JoinColumn, OneToMany, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { User } from "../user/user.entity";
import { CategorieLivreur } from "./categorie-livreur/categorie-livreur.entity";
import { LivreurTemporaireEntity } from "./livreur-temporaire/livreur-temporaire.entity";
import { TourneeLivraisonEntity } from "../tournee-livraison/tournee-livraison.entity";
import { BordereauLivraisonEntity } from "../bordereau-livraison/bordereau-livraison.entity";


@Entity("livreur_information")
export class Livreur {
    @PrimaryGeneratedColumn()
    id_livreur: number;

    @Column()
    total_points: number;

    @Column()
    peut_faire_chargement_colis: boolean;

    @Column()
    total_livraison_effectue: number;

    @OneToOne(() => CategorieLivreur, {eager: true})
    @JoinColumn({name: "id_categorie_livreur"})
    categorie_livreur: CategorieLivreur;

    @OneToOne(() => User, (l) => l.livreur, {
        eager: true,
        cascade: ['insert']
    })
    @JoinColumn({name:"id_utilisateur"})
    user: User;

    @OneToMany(() => LivreurTemporaireEntity, (l) => l.livreur_parent, {
        lazy: true
    })
    livreurs_temporaire: Promise<LivreurTemporaireEntity[]>|LivreurTemporaireEntity[];

    @OneToMany(() => TourneeLivraisonEntity, (t) => t.livreur)
    tournees_livraison: TourneeLivraisonEntity[];
    
    @OneToMany(() => BordereauLivraisonEntity, (b) => b.livreur)
    bordereaux_livraison: BordereauLivraisonEntity[];
}