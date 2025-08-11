import { PrimaryGeneratedColumn, Column, OneToOne, JoinColumn, Entity, Timestamp } from "typeorm";
import { ContrainteLivraison } from "../contrainte-livraison/contrainte-livraison.entity";
import { timestamp } from "rxjs";

@Entity("contrainte_jour_livraison")
export class ContrainteJourLivraison {
    @PrimaryGeneratedColumn()
    id_contrainte_jour_livraison: number;

    @Column()
    jour:string;
    
    @Column()
    est_livrable: boolean;

    @Column({type: "time"})
    heure_debut: string;

    @Column({type: "time"})
    heure_fin: string;
    
    @OneToOne(() => ContrainteLivraison)
    @JoinColumn({name: "id_contrainte_livraison"})
    contrainte_livraison: ContrainteLivraison;
}