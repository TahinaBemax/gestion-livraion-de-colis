import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity("evenements_locaux")
export class EvenementLocalEntity {
    @PrimaryGeneratedColumn({name: "id_evenement"})
    id: number;

    @Column()
    nom_evenement: string;

    @Column()
    jour_semaine: string;

    @Column()
    date_debut: Date;

    @Column()
    date_fin: Date;

    @Column()
    type: string;

    @Column()
    frequence: string;   
}