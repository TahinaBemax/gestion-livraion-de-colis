import { Column, Entity, JoinColumn, JoinTable, ManyToMany, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { ColisEntity } from './colis.entity';

@Entity("produits")
export class DetailColisEntity {
    @PrimaryGeneratedColumn({name: "ref_produit"})
    id: string;
    
    @Column()
    description_produit:string;

    @Column()
    poids_produit: number;
    
    @Column()
    valeur_produit: number;

    @ManyToOne(() => ColisEntity, (c) => c.details_colis)
    @JoinColumn({name: "id_colis", referencedColumnName: "id"})
    colis: ColisEntity;
}