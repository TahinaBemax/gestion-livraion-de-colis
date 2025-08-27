import { Column, Entity, JoinColumn, JoinTable, ManyToMany, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { User } from "../user/user.entity";

@Entity("notifications")
export class NotificationEntity {
    @PrimaryGeneratedColumn({name: "id_notification"})
    id: number;

    @Column()
    titre:string;
    
    @Column()
    message: string;
    
    @Column()
    dateheure_notification: Date;

    @ManyToOne(() => User , (u) => u.notifications_envoye, { eager: true})
    @JoinColumn({name: "id_envoyeur", referencedColumnName: "id_utilisateur"})
    envoyeur: User;
    
    @ManyToMany(() => User , (u) => u.notifications_recu, { 
        eager: true,
        cascade: ["insert", "remove"],
        onDelete: "CASCADE"
    })
    @JoinTable({
        name: 'notifications_recus',
        joinColumn: { name: 'id_notification', referencedColumnName: 'id' },
        inverseJoinColumn: { name: 'id_utilisateur'},
    }) 
    receveurs: User[];
}