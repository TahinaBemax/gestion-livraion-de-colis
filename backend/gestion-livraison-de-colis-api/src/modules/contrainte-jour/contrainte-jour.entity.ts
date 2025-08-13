import { ContrainteLivraisonEntity } from './../contrainte-livraison/contrainte-livraison.entity';
import { Entity, PrimaryGeneratedColumn, Column, OneToOne, JoinColumn, ManyToOne } from "typeorm";

@Entity("contraintes_jours")
export class ContrainteJourEntity {
    @PrimaryGeneratedColumn({name: "id_contrainte_jour"})
    id: number;

    @Column()
    jour:string;
    
    @Column()
    est_livrable: boolean;

    @Column({type: "time"})
    heure_debut: string;

    @Column({type: "time"})
    heure_fin: string;
    
    @ManyToOne(() => ContrainteLivraisonEntity, (cl) => cl.contrainte_jour_livraisons)
    @JoinColumn({referencedColumnName: "id", name:"id_contrainte_livraison"})
    contrainte_livraison: ContrainteLivraisonEntity;
}