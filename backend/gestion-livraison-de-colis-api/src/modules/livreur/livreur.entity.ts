import { Column, Entity, IntegerType, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { User } from "../user/user.entity";
import { CategorieLivreur } from "./categorie-livreur/categorie-livreur.entity";


@Entity("detail_info_livreur")
export class Livreur {
    @PrimaryGeneratedColumn()
    @Column("id_detail_info_livreur")
    id_livreur: Number;

    @Column()
    total_points: number;

    @Column()
    rang_global: number;

    @Column()
    peut_faire_chargement_colis: boolean;

    @Column()
    qr_code: string;

    @Column()
    total_livraison_effectue: number;

    @OneToOne(() => CategorieLivreur)
    categorie_livreur: CategorieLivreur;

    @OneToOne(() => User)
    user: User;
}