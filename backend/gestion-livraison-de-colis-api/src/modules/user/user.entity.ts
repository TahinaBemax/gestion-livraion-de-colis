import { NotificationEntity } from './../notification/notification.entity';
import { Entity, PrimaryGeneratedColumn, Column, Unique, JoinColumn, OneToOne, OneToMany, ManyToMany } from 'typeorm';
import { Prestataire } from '../prestataire/prestataire.entity';
import { Role } from '../role/role.entity';
import { TypeUtilisateur } from './type-utilisateur/type-utilisateur.entity';
import { Livreur } from '../livreur/livreur.entity';


@Entity("utilisateurs")
@Unique(["adresse_email", "numero_telephone", "photo_profil", "mot_de_passe"])
export class User {
    @PrimaryGeneratedColumn()
    id_utilisateur: number;

    @Column()
    nom: string;

    @Column()
    prenom: string;

    @Column({nullable: true})
    civilite: string;
    
    @Column({type: 'date', nullable: true})
    date_naissance: string;

    @Column()
    numero_telephone: string;

    @Column()
    adresse_email: string;

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

    @OneToOne(() => Prestataire, { nullable: true})
    @JoinColumn({name: "id_prestataire"})
    prestataire?: Prestataire;

    @OneToOne(() => Livreur, (l) => l.user, {
        cascade: false
    })
    livreur?: Livreur;

    @OneToMany(() => NotificationEntity, (notif) => notif.envoyeur)
    notifications_envoye?: NotificationEntity[];

    @ManyToMany(() => NotificationEntity, (notif) => notif.receveurs)
    notifications_recu?: NotificationEntity[];
}
