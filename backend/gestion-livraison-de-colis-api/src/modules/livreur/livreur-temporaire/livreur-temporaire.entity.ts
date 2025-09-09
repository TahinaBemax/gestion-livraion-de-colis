import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn, Unique } from "typeorm";
import { Livreur } from "../livreur.entity";

@Entity("livreurs_temporaire")
@Unique(["mot_de_passe", "telephone"])
export class LivreurTemporaireEntity {
    @PrimaryGeneratedColumn({name: "id_livreur_temporaire"})
    id: number;

    @Column()
    nom:string;

    @Column()
    prenom:string;
    
    @Column({type: "date"})
    date_naissance: string;
    
    @Column()
    telephone: string;

    @Column()
    mot_de_passe: string;

    @Column()
    est_active:boolean;

    @Column({type: "date", default: new Date()})
    date_creation: string;
    
    @ManyToOne(() => Livreur, (l) => l.livreurs_temporaire, { eager: true })
    @JoinColumn({name:"id_livreur"})
    livreur_parent: Livreur;
}