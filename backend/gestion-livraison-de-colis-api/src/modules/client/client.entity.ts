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
    civilite?: string;

    @Column({type: "text"})
    numero_telephone: string;
    
    @Column({type: "text"})
    adresse_mail: string;

    @OneToMany(() => LivraisonEntity, (l) => l.client, {
        nullable: true
    })
    livraisons?: LivraisonEntity[];
}