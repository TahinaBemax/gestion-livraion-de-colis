import { Column, Entity, JoinColumn, OneToMany, PrimaryColumn } from "typeorm";
import { Livreur } from "../livreur.entity";

@Entity("categories_livreur")
export class CategorieLivreur{
    @PrimaryColumn()
    id_categorie_livreur: string;

    @Column()
    categorie_livreur: string;

    @OneToMany(() => Livreur, (livreur) => livreur.categorie_livreur)
    @JoinColumn({name: "id_livreur"})
    Livreurs: Livreur[];
}