import { Column, Entity, JoinColumn, OneToMany, PrimaryGeneratedColumn, Unique } from "typeorm";
import { User } from "../user/user.entity";

@Entity()
@Unique(["nom_entreprise", "nif", "stat", "email", "telephone"])
export class Prestataire {
    @PrimaryGeneratedColumn()
    id_prestataire: number;

    @Column()
    nom_entreprise: string;

    @Column()
    nif?: string;

    @Column()
    stat?: string;

    @Column()
    adresse1: string;

    @Column()
    adresse2?: string;

    @Column()
    departement: string;

    @Column()
    etat?: string;

    @Column()
    ville: string;

    @Column()
    pays: string;

    @Column()
    code_postal: string;

    @Column()
    telephone?: string;

    @Column()
    email: string;

    @Column({nullable: false, default: true})
    est_active: boolean;

    @OneToMany(() => User, (user) => user.prestataire, {lazy: true})
    @JoinColumn({name:"id_utilisateur"})
    users: User[];
}