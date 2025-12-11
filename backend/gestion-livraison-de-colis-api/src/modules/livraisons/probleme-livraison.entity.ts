import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { LivraisonEntity } from "./livraison.entity";


@Entity("problemes_livraison")
export class ProblemeLivraisonEntity {
    @PrimaryGeneratedColumn({name: "id_probleme_livraison"})
    id: number;

    @Column()
    titre: string;

    @Column({nullable: true})
    description: string;

    @ManyToOne(() => LivraisonEntity, (l) => l.problemes_livraison)
    @JoinColumn({referencedColumnName: "id", name: "id_livraison"})
    livraison: LivraisonEntity;
}