import { Column, Entity, OneToMany, PrimaryGeneratedColumn, Unique } from "typeorm";
import { User } from "../user/user.entity";
import { IsBoolean, IsEmail, IsNotEmpty, IsNumberString, IsOptional, IsPhoneNumber } from "class-validator";
import { TourneeLivraisonEntity } from "../tournee-livraison/tournee-livraison.entity";
import { PointLivraisonEntity } from "../point-livraison/point-livraison.entity";

@Entity("prestataires")
@Unique(["nom_entreprise", "nif", "stat", "adresse_email", "numero_telephone", "nom_image_logo"])
export class Prestataire {
    @PrimaryGeneratedColumn()
    id_prestataire: number;

    @Column()
    @IsNotEmpty()
    nom_entreprise: string;
    
    @Column()
    @IsNotEmpty()
    nif: string;
    
    @Column()
    @IsNotEmpty()
    stat: string;
    
    @Column()
    @IsNotEmpty()
    adresse_principale: string;
    
    @Column()
    @IsOptional()
    @IsNotEmpty()
    adresse_complementaire?: string;
    
    @Column()
    @IsNotEmpty()
    departement?: string;
    
    @Column()
    @IsOptional()
    @IsNotEmpty()
    etat?: string;
    
    @Column()
    @IsNotEmpty()
    ville?: string;
    
    @Column()
    @IsNotEmpty()
    pays?: string;
    
    @Column()
    @IsNotEmpty()
    @IsNumberString()
    @IsNumberString()
    code_postal?: string;

    @Column()
    @IsPhoneNumber()
    numero_telephone: string;

    @Column()
    @IsEmail()
    adresse_email: string;

    @Column()
    nom_image_logo?: string;

    @Column({nullable: false, default: true})
    @IsBoolean()
    est_active: boolean;

    @OneToMany(() => User, (user) => user.prestataire, {
        lazy: true,
        cascade: ['insert']
    })
    users: Promise<User[]>|User[];

    @OneToMany(() => TourneeLivraisonEntity, (t) => t.prestataire, {
        lazy: true,
        cascade: false
    })
    tournees_livraison: Promise<TourneeLivraisonEntity[]>|TourneeLivraisonEntity[];

    @OneToMany(() => PointLivraisonEntity, (pl) => pl.prestataire, {
        lazy: true,
        cascade: false
    })
    points_livraison: Promise<PointLivraisonEntity[]>|PointLivraisonEntity[];
}