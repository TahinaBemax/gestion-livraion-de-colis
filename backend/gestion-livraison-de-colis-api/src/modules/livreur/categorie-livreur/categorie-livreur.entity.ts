import { Livreur } from './../livreur.entity';
import { Column, Entity, OneToMany, PrimaryColumn } from "typeorm";
import { Livreur } from "../livreur.entity";

@Entity("categorie_livreur")
export class CategorieLivreur{
    @PrimaryColumn()
    id_categorie_livreur: string;

    @Column()
    categorie_livreur: string;

    @OneToMany(() => Livreur, (livreur) => livreur.categorie_livreur)
    Livreurs: Livreur[];
}