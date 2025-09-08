import { Column, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn, Unique } from "typeorm";
import { LivraisonEntity } from "../livraisons/livraison.entity";
import { PointLivraisonEntity } from "../point-livraison/point-livraison.entity";

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

    @ManyToOne(() => PointLivraisonEntity, (p) => p.clients, {
        eager: true,
    })
    @JoinColumn({name: "id_point_livraison", referencedColumnName: "id"})
    point_livraison: PointLivraisonEntity;
}