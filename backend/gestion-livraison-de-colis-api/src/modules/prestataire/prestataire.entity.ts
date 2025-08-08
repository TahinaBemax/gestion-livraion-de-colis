import { Column, Entity, JoinColumn, OneToMany, PrimaryGeneratedColumn, Unique } from "typeorm";
import { User } from "../user/user.entity";
import { IsBoolean, IsEmail, IsNotEmpty, IsNumberString, IsOptional, IsPhoneNumber } from "class-validator";

@Entity()
@Unique(["nom_entreprise", "nif", "stat", "email", "telephone"])
export class Prestataire {
    @PrimaryGeneratedColumn()
    id_prestataire: number;

    @Column()
    @IsNotEmpty()
    nom_entreprise: string;
    
    @Column()
    @IsNotEmpty()
    nif?: string;
    
    @Column()
    @IsNotEmpty()
    stat?: string;
    
    @Column()
    @IsNotEmpty()
    adresse1: string;
    
    @Column()
    @IsOptional()
    @IsNotEmpty()
    adresse2?: string;
    
    @Column()
    @IsNotEmpty()
    departement: string;
    
    @Column()
    @IsOptional()
    @IsNotEmpty()
    etat?: string;
    
    @Column()
    @IsNotEmpty()
    ville: string;
    
    @Column()
    @IsNotEmpty()
    pays: string;
    
    @Column()
    @IsNotEmpty()
    @IsNumberString()
    @IsNumberString()
    code_postal: string;

    @Column()
    @IsPhoneNumber()
    telephone?: string;

    @Column()
    @IsEmail()
    email: string;

    @Column({nullable: false, default: true})
    @IsBoolean()
    est_active: boolean;

    @OneToMany(() => User, (user) => user.prestataire, {lazy: true})
    @JoinColumn({name:"id_utilisateur"})
    users: User[];
}