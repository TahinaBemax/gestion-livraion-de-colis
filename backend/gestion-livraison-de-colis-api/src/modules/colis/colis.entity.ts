import { Column, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn, Unique } from "typeorm";
import { DetailColisEntity } from "./detail-colis.entity";
import { ProblemeColisEntity } from "./probleme-colis.entity";
import { LivraisonEntity } from "../livraisons/livraison.entity";

@Entity("colis")
@Unique(["code_barre", "code_barre_client"])
export class ColisEntity{
    @PrimaryGeneratedColumn({name: "id_colis"})
    id: number;

    @Column()
    nom_destinataire:string;
    
    @Column()
    code_barre: string;
    
    @Column()
    code_barre_client: string;
    
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

    @ManyToOne(() => LivraisonEntity, (l) => l.colis)
    @JoinColumn({name: "id_livraison", referencedColumnName: "id"})
    livraisons: LivraisonEntity[];
}