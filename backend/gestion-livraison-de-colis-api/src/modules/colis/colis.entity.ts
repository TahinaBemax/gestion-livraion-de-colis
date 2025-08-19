import { Column, Entity, OneToMany, PrimaryGeneratedColumn, Unique } from "typeorm";
import { DetailColisEntity } from "./detail-colis.entity";
import { ProblemeColisEntity } from "./probleme-colis.entity";
import { LivraisonEntity } from "../livraisons/livraison.entity";

@Entity("colis")
@Unique(["qrcode_client", "qrcode"])
export class ColisEntity{
    @PrimaryGeneratedColumn({name: "id_colis"})
    id: number;

    @Column()
    nom_destinataire:string;
    
    @Column()
    qrcode: string;
    
    @Column()
    qrcode_client: string;
    
    @Column()
    poids_total: number;
    
    @Column()
    status: string;

    @OneToMany(() => DetailColisEntity, (d) => d.colis, {
        eager: true, 
        cascade: true, 
        onUpdate: "CASCADE"
    })
    details_colis: DetailColisEntity[];

    @OneToMany(() => ProblemeColisEntity, (d) => d.colis, {
        eager: true,
    })
    problemes: ProblemeColisEntity[];

    @OneToMany(() => LivraisonEntity, (l) => l.colis)
    livraisons: LivraisonEntity[];
}