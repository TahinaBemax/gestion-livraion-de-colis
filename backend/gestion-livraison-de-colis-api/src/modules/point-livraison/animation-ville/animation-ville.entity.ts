import { PrimaryGeneratedColumn, Column, OneToOne, JoinColumn, Entity, Timestamp, Unique, OneToMany } from "typeorm";
import { PointLivraison } from "../point-livraison.entity";
import { ContrainteAnimationVille } from "src/modules/contrainte-animation-ville/contrainte-animation-ville.entity";

@Entity("animations_villes")
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

    @Column({type: "time"})
    heure_debut: string;

    @Column({type: "time"})
    heure_fin: string;
    
    @OneToMany(() => ContrainteAnimationVille, (c) => c.animation_ville, {cascade: true, onUpdate: "CASCADE"})
    @JoinColumn({name: "id_contrainte_animation_ville"})
    contrainte_animation_ville?: ContrainteAnimationVille[];
}