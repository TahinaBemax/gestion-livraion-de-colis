import { Column, Entity, JoinColumn, JoinTable, ManyToMany, ManyToOne, OneToMany, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { ColisEntity } from "../colis/colis.entity";
import { PointLivraisonEntity } from "../point-livraison/point-livraison.entity";
import { ProblemeLivraisonEntity } from "./probleme-livraison.entity";
import { OrdreLivraisonEntity } from "../ordre-livraison/ordre-livraison.entity";
import { ClientEntity } from "../client/client.entity";

@Entity("livraisons")
export class LivraisonEntity {
    @PrimaryGeneratedColumn({name: "id_livraison"})
    id: number; 

    @Column()
    nom_destinataire: string;

    @Column()
    adresse_principale: string;

    @Column()
    complement_adresse?: string;

    @Column()
    ville: string;
    
    @Column()
    pays?: string;

    @Column()
    code_postal: string;
    
    @Column({type: "date"})
    date_livraison: string;
    
    @Column({type: "time"})
    heure_debut?: string;
    
    @Column({type: "time"})
    heure_fin?: string;
    
    @Column()
    notes?: string;

    @Column()
    statut_livraison: string;

    @OneToMany(() => ColisEntity, (c) => c.livraisons, {
        eager: true,
        cascade: ['insert'], 
        lazy:false,
        onUpdate: "CASCADE"
    })
    colis: ColisEntity[];

    @OneToMany(() => ProblemeLivraisonEntity, (p) => p.livraison, {
        eager: true
    })
    problemes_livraison: ProblemeLivraisonEntity[];

    @ManyToMany(() => OrdreLivraisonEntity, (ordre) => ordre.livraisons)
    @JoinTable({
        name: 'details_ordre_livraison',
        joinColumn: { name: 'id_livraison', referencedColumnName: 'id' },
        inverseJoinColumn: { name: 'id_ordre_livraison', referencedColumnName: 'id'},
    })    
    ordres_livraison: OrdreLivraisonEntity[];

    @ManyToOne(() => ClientEntity, (c) => c.livraisons, {
        eager: true,
    })
    @JoinColumn({name: "id_client", referencedColumnName: "id"})
    client: ClientEntity;
}