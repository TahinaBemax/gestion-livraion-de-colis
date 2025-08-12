import { Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { PointLivraison } from "../point-livraison/point-livraison.entity";
import { AnimationVille } from "../point-livraison/animation-ville/animation-ville.entity";

@Entity("contraintes_animations_villes")
export class ContrainteAnimationVille {
    @PrimaryGeneratedColumn()
    id_contrainte_animation_ville:number;

    @ManyToOne(() => PointLivraison,)
    @JoinColumn({name: "id_point_livraison"})
    point_livraison:PointLivraison;

    @ManyToOne(() => AnimationVille,)
    @JoinColumn({name: "id_animation_ville"})
    animation_ville: AnimationVille;
}