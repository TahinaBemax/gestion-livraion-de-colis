import { Column, Entity, ManyToOne, OneToMany, PrimaryColumn, PrimaryGeneratedColumn, Unique } from "typeorm";
import { User } from "../user/user.entity";

@Entity()
@Unique(['nom_role'])
export class Roles {
    @PrimaryColumn()
    id_role: number;

    @Column({nullable: false})
    nom_role: string;

    @OneToMany(() => User, (user) => user.role)
    users: User[];
}