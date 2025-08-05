import { PrimaryGeneratedColumn, Column, OneToOne, JoinColumn, Entity, Timestamp, Unique } from "typeorm";
import { PointLivraison } from "../point-livraison.entity";

@Entity("animations_ville")
@Unique(["intitule_animation"])
export class AnimationVille {
    @PrimaryGeneratedColumn()
    id_animation_ville: number;
    
    @Column()
    intitule_animation: string;

    @Column()
    date_debut: Date;

    @Column()
    date_fin: Date;

    @Column()
    heure_debut: Date;

    @Column()
    heure_fin: Date;
    
    @OneToOne(() => PointLivraison)
    @JoinColumn({name: "id_point_livraison"})
    point_livraison?: PointLivraison;
}