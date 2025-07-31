import { Entity, PrimaryGeneratedColumn, Column, Unique, ManyToOne, JoinColumn, OneToOne } from 'typeorm';
import { Prestataire } from '../prestataire/prestataire.entity';
import { Roles } from '../role/role.entity';
import { TypeUtilisateur } from './type-utilisateur/type-utilisateur.entity';


@Entity()
@Unique(["email", "telephone", "photo_profil", "mot_de_passe"])
export class User {
    @PrimaryGeneratedColumn()
    id_utilisateur: number;

    @Column()
    nom: string;

    @Column()
    prenom: string;

    @Column()
    date_naissance: Date;

    @Column()
    telephone?: string;

    @Column()
    email: string;

    @Column()
    mot_de_passe: string;

    @Column()
    est_active: boolean;

    @Column()
    photo_profil?: string;

    @OneToOne(() => Roles)
    @JoinColumn()
    role: Roles;

    @OneToOne(() => TypeUtilisateur, (typeUtilisateur) => typeUtilisateur.users)
    @JoinColumn()
    type_utilisateur: TypeUtilisateur;

    @OneToOne(() => Prestataire)
    prestataire?: Prestataire;
}
