import { Column, Entity, ManyToOne, OneToMany, PrimaryColumn, PrimaryGeneratedColumn, Unique } from "typeorm";
import { User } from "../user/user.entity";
import { ApiProperty } from "@nestjs/swagger";

@Entity("roles")
@Unique(['nom_role'])
export class Role {
    @PrimaryColumn({name: "id_role"})
    @ApiProperty({
        example: "ROLE-01",
        description: "ID Admin"
    })
    id: string;

    @Column({nullable: false})
    @ApiProperty({example: "Admin"})
    nom_role: string;

    @OneToMany(() => User, (user) => user.role)
    users: User[];
}