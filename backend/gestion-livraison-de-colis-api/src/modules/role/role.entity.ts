import { Column, Entity, ManyToOne, OneToMany, PrimaryColumn, PrimaryGeneratedColumn, Unique } from "typeorm";
import { User } from "../user/user.entity";

@Entity("roles")
@Unique(['nom_role'])
export class Role {
    @PrimaryColumn({name: "id_role"})
    id: string;

    @Column({nullable: false})
    nom_role: string;

    @OneToMany(() => User, (user) => user.role)
    users: User[];
}