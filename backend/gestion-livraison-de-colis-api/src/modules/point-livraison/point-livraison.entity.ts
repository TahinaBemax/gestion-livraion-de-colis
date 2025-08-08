import { Column, Entity, JoinColumn, OneToMany, OneToOne, PrimaryGeneratedColumn, Unique } from "typeorm";
import { Prestataire } from "../prestataire/prestataire.entity";
import { ContrainteLivraison } from "./contrainte-livraison/contrainte-livraison.entity";
import { AnimationVille } from "./animation-ville/animation-ville.entity";

@Entity("points_livraison")
@Unique(["numero_magasin"])
export class PointLivraison {
    forEach(arg0: (pl: any) => void) {
        throw new Error('Method not implemented.');
    }
    @PrimaryGeneratedColumn()
    id_point_livraison: number;

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

    @OneToOne(() => Prestataire)
    @JoinColumn({name: "id_prestataire"})
    prestataire?: Prestataire;

    @OneToMany(() => ContrainteLivraison, (contrainte) => contrainte.point_livraison, {eager: true, cascade:true, onUpdate: "CASCADE"})
    @JoinColumn({name: "id_contrainte_livraison"})
    contraintes_livraison?: ContrainteLivraison[];

    @OneToMany(() => AnimationVille, (animation) => animation.point_livraison, {eager: true, cascade:true, onUpdate: "CASCADE"})
    @JoinColumn({name: "id_animation"})
    animations_ville?: AnimationVille[];
}