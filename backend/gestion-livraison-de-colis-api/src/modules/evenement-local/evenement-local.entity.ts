import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity("evenements_locaux")
export class EvenementLocalEntity {
    @PrimaryGeneratedColumn({name: "id_evenement"})
    id: number;

    @Column()
    nom_evenement: string;

    @Column()
    jour_semaine: string;

    @Column({type: 'date'})
    date_debut: string;

    @Column({type: 'date'})
    date_fin: string;

    @Column()
    type_evenement: string;

    @Column()
    frequence_evenement: string;   
}