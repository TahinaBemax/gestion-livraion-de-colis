import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { ColisEntity } from "./colis.entity";


@Entity("problemes_colis")
export class ProblemeColisEntity {
    @PrimaryGeneratedColumn({name: "id_probleme_colis"})
    id: number;

    @Column()
    titre: string;

    @Column({nullable: true})
    description: string;

    @ManyToOne(() => ColisEntity, (c) => c.problemes)
    @JoinColumn({referencedColumnName: "id", name: "id_colis"})
    colis: ColisEntity;
}