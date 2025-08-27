import { Column, Entity, OneToMany, PrimaryGeneratedColumn, Unique } from "typeorm";
import { LivraisonEntity } from "../livraisons/livraison.entity";

@Entity("clients")
@Unique(["numero_telephone", "adresse_mail"])
export class ClientEntity {
    @PrimaryGeneratedColumn({name: "id_client"})
    id: number;

    @Column({type: "text"})
    nom_client: string;

    @Column({type: "text"})
    prenom_client: string;

    @Column({type: "text", nullable: true})
    civilite: string;

    @Column({type: "text"})
    numero_telephone: string;
    
    @Column({type: "text"})
    adresse_mail: string;

    @Column({type: "text"})
    code_postal: string;

    @Column({type: "text", nullable: true})
    lot_maison?: string;

    @Column({type: "text", nullable: true})
    numero_rue?: string;

    @Column({type: "text", nullable: true})
    nom_rue?: string;

    @Column({type: "text"})
    ville: string;

    @Column({type: "text", nullable: true})
    pays?: string;

    @Column({type: "text", nullable: true})
    complement_adresse?: string;

    @OneToMany(() => LivraisonEntity, (l) => l.client)
    livraisons: LivraisonEntity[];
}