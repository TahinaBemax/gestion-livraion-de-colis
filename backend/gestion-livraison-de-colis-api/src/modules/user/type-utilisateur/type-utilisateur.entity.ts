import { Column, Entity, JoinColumn, OneToMany, PrimaryColumn, Unique } from "typeorm";
import { User } from "../user.entity";


@Entity("types_utilisateurs")
@Unique(["type"])
export class TypeUtilisateur {
    @PrimaryColumn()
    id_type_utilisateur: string;

    @Column({nullable: false })
    type: string;

    @OneToMany(() => User, (user) => user.type_utilisateur)
    users: User[];
}