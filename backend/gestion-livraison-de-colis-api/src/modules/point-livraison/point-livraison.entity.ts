import { Column, Entity, JoinColumn, ManyToOne, OneToMany, OneToOne, PrimaryGeneratedColumn, Unique } from "typeorm";
import { Prestataire } from "../prestataire/prestataire.entity";
import { ContrainteLivraisonEntity } from "../contrainte-livraison/contrainte-livraison.entity";
import { ContrainteEvenementEntity } from "../contrainte-evenement/contrainte-evenement.entity";
import { LivraisonEntity } from "../livraisons/livraison.entity";

@Entity("points_livraisons")
@Unique(["numero_magasin"])
export class PointLivraisonEntity {
    @PrimaryGeneratedColumn({name: "id_point_livraison"})
    id: number;

    @Column()
    numero_magasin: string;

    @Column()
    nom_rue: string;

    @Column()
    departement: string;

    @Column()
    ville: string;

    @Column()
    pays: string;

    @Column()
    latitude: number;

    @Column()
    longitude: number;

    @Column()
    code_postal: string;

    @Column()
    complement_adresse: string;

    @ManyToOne(() => Prestataire)
    @JoinColumn({name: "id_prestataire", referencedColumnName: "id_prestataire"})
    prestataire?: Prestataire;

    @OneToMany(() => ContrainteLivraisonEntity, (c) => c.point_livraison, {
        eager: true, 
        cascade:true, 
        onUpdate: "CASCADE"
    })
    contraintes_livraison?: ContrainteLivraisonEntity[];

    @OneToMany(() => ContrainteEvenementEntity, (a) => a.point_livraison, {
        eager: true, 
        cascade:true, 
        onUpdate: "CASCADE"
    })
    contraintes_evenements?: ContrainteEvenementEntity[];

    @OneToMany(() => LivraisonEntity, (l) => l.point_livraison)
    livraisons: LivraisonEntity[];
}