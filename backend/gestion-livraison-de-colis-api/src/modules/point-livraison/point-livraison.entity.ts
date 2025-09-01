import { Column, Entity, JoinColumn, ManyToOne, OneToMany, OneToOne, PrimaryGeneratedColumn, Unique } from "typeorm";
import { Prestataire } from "../prestataire/prestataire.entity";
import { ContrainteLivraisonEntity } from "../contrainte-livraison/contrainte-livraison.entity";
import { ContrainteEvenementEntity } from "../contrainte-evenement/contrainte-evenement.entity";
import { LivraisonEntity } from "../livraisons/livraison.entity";
import { OrdreLivraisonEntity } from "../ordre-livraison/ordre-livraison.entity";

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
    numero_rue: string;

    @Column()
    departement?: string;

    @Column()
    ville: string;

    @Column({nullable : true})
    pays?: string;

    @Column({nullable : true})
    latitude?: number;

    @Column({nullable : true})
    longitude?: number;

    @Column()
    code_postal: string;

    @Column({nullable : true})
    complement_adresse?: string;

    @ManyToOne(() => Prestataire, {nullable: true})
    @JoinColumn({name: "id_prestataire", referencedColumnName: "id_prestataire"})
    prestataire?: Prestataire;

    @OneToMany(() => ContrainteLivraisonEntity, (c) => c.point_livraison, {
        eager: true, 
        cascade:true, 
        onUpdate: "CASCADE",
        nullable: true
    })
    contraintes_livraison?: ContrainteLivraisonEntity[];

    @OneToMany(() => ContrainteEvenementEntity, (a) => a.point_livraison, {
        eager: true, 
        cascade: true, 
        onUpdate: "CASCADE",
        nullable: true
    })
    contraintes_evenements?: ContrainteEvenementEntity[];

    @OneToMany(() => LivraisonEntity, (l) => l.point_livraison)
    livraisons: LivraisonEntity[];

    @OneToMany(() => OrdreLivraisonEntity, (ordre) => ordre.point_livraison)
    ordres_livraison: OrdreLivraisonEntity[];
}