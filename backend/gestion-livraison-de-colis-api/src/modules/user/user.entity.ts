import { Entity, PrimaryGeneratedColumn, Column, Unique, ManyToOne, JoinColumn, OneToOne } from 'typeorm';
import { Prestataire } from '../prestataire/prestataire.entity';
import { Role } from '../role/role.entity';
import { TypeUtilisateur } from './type-utilisateur/type-utilisateur.entity';


@Entity("utilisateurs")
@Unique(["email", "telephone", "photo_profil", "mot_de_passe", "login"])
export class User {
    @PrimaryGeneratedColumn()
    id_utilisateur?: number;

    @Column()
    nom: string;

    @Column()
    prenom: string;

    @Column({nullable: false})
    civilite: string;
    
    @Column()
    date_naissance: Date;

    @Column({nullable: true})
    telephone?: string;

    @Column()
    email: string;

    @Column({nullable: false})
    login: string;

    @Column()
    mot_de_passe: string;

    @Column({default: true })
    est_active: boolean;

    @Column({ nullable: true })
    photo_profil?: string;

    @OneToOne(() => Role, {eager: true})
    @JoinColumn({name: "id_role"})
    role: Role;

    @OneToOne(() => TypeUtilisateur, (typeUtilisateur) => typeUtilisateur.users, {eager: true})
    @JoinColumn({name: "id_type_utilisateur"})
    type_utilisateur: TypeUtilisateur;

    @OneToOne(() => Prestataire, { nullable: true })
    @JoinColumn({name: "id_prestataire"})
    prestataire?: Prestataire;
}
