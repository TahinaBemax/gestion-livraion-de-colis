import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { ColisEntity } from './colis.entity';

@Entity("detail_colis")
export class DetailColisEntity {
    @PrimaryGeneratedColumn({name: "id_detail_colis"})
    id: number;
    
    @Column()
    description:string;

    @Column()
    poids: number;
    
    @Column()
    valeur_declaree: number;

    @ManyToOne(() => ColisEntity, (c) => c.details_colis)
    @JoinColumn({name: "id_colis", referencedColumnName: "id"})
    colis: ColisEntity;
}