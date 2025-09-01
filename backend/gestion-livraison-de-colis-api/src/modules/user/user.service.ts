import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './user.entity';
import { CreateUserDto } from 'src/common/dto/create-user-dto';
import { UserMapper } from './utils/user.mapper';
import { UpdateUserDto } from 'src/common/dto/update-user-dto';

@Injectable()
export class UserService {
    constructor(
        @InjectRepository(User)
        private readonly userRepo: Repository<User>, 
        private readonly userMapper: UserMapper
    ){}

    async filterBy(nom?: string, prenom?: string, role?: string, nomEntreprise?: string): Promise<User[]> {
        const queryBuilder = this.userRepo.createQueryBuilder('user')
            .leftJoinAndSelect('user.prestataire', 'prestataire')
            .innerJoinAndSelect('user.role', 'role')
            .innerJoinAndSelect("u.type_utilisateur", "tu")
            .where('user.est_active = :estActive', { estActive: true })
            .andWhere("tu.id_type_utilisateur = :tempoOne OR tu.id_type_utilisateur = :prestataire", 
            { 
                tempoOne: "TYPE-USER-00001", 
                prestataire: "TYPE-USER-00002" 
            });

        if (nom) {
            queryBuilder.andWhere('user.nom ILIKE :nom', { nom: `%${nom}%` });
        }

        if (prenom) {
            queryBuilder.andWhere('user.prenom ILIKE :prenom', { prenom: `%${prenom}%` });
        }

        if (role) {
            queryBuilder.andWhere('role.nom_role ILIKE :role', { role: `%${role}%` });
        }

        if (nomEntreprise) {
            queryBuilder.andWhere('prestataire.nom_entreprise ILIKE :nomEntreprise', { nomEntreprise: `%${nomEntreprise}%` });
        }

        return await queryBuilder.getMany();
    }

    async prestataireUsersfilterBy(idPrestataire?: number, nom?: string, prenom?: string, nomEntreprise?: string): Promise<User[]> {
        const queryBuilder = this.userRepo.createQueryBuilder('user')
            .innerJoinAndSelect('user.prestataire', 'prestataire')
            .innerJoinAndSelect("u.type_utilisateur", "tu")
            .innerJoinAndSelect("u.role", "role")
            .where('user.est_active = :estActive', { estActive: true })
            .andWhere("tu.id_type_utilisateur = :prestataire", 
            { 
                prestataire: "TYPE-USER-00002" 
            });

        if (idPrestataire) {
            queryBuilder.andWhere('prestataire.id_prestataire = :idPrestataire', {
                idPrestataire: idPrestataire
            });
        }

        if (nom) {
            queryBuilder.andWhere('user.nom ILIKE :nom', { nom: `%${nom}%` });
        }

        if (prenom) {
            queryBuilder.andWhere('user.prenom ILIKE :prenom', { prenom: `%${prenom}%` });
        }

        if (nomEntreprise) {
            queryBuilder.andWhere('prestataire.nom_entreprise ILIKE :nomEntreprise', { nomEntreprise: `%${nomEntreprise}%` });
        }

        const matched = await queryBuilder.getMany();
        return matched.map(user => {
            return { ...user, mot_de_passe: "" }
        });
    }

    async saveInterneUser(create_user: CreateUserDto): Promise<User>{
        const user: User = await this.userMapper.fromDtoToUser(create_user);
        const temp_user = this.userRepo.create(user);
        const saved = await this.userRepo.save(temp_user);
        const {mot_de_passe, ...withoutPassword} = saved;

        return saved;
    }

    async updateUser(id: number, dto: UpdateUserDto): Promise<User>{
        const user: User = await this.findById(id);
        this.userMapper.mapUpdateUserDtoToUser(user, dto);
        const updated = await this.userRepo.save(user);
        const {mot_de_passe, ...userWithoutPassword} = updated;
        
        return updated;
    }

    async savePrestataireUser(idPrestataire: number, user: CreateUserDto): Promise<User>{
        if(!idPrestataire) throw new BadRequestException("L'id de prestataire est null");
        if(!user) throw new BadRequestException("Le user est null");

        const user_entity:User = await this.userMapper.fromDtoWithPrestataire(user, idPrestataire);
        const temp_user = this.userRepo.create(user_entity);
        const saved = this.userRepo.save(temp_user);

        return {...saved , mot_de_passe: ""};
    }

    async findAll():Promise<User[]>{
        const users = await this.userRepo.createQueryBuilder("u")
        .innerJoinAndSelect("u.type_utilisateur", "tu")
        .innerJoinAndSelect("u.role", "role")
        .where("u.est_active = :estActive", { estActive: true })
        .andWhere("tu.id_type_utilisateur = :tempoOne OR tu.id_type_utilisateur = :prestataire", 
            { 
                tempoOne: "TYPE-USER-00001", 
                prestataire: "TYPE-USER-00002" 
            })
            .getMany();

        return users.map(user => {
            return { ...user, mot_de_passe: "" }
        });
    }
        
    async findTempoOneUsers():Promise<User[]>{
        const users = await this.userRepo.createQueryBuilder("u")
            .innerJoinAndSelect("u.role", "role")
            .innerJoinAndSelect("u.type_utilisateur", "tu")
            .where("u.est_active = :estActive", { estActive: true })
            .andWhere("tu.id_type_utilisateur = :typeUtilisateur", { typeUtilisateur: "TYPE-USER-00001" })
            .getMany();

        return users.map(user => {
            return { ...user, mot_de_passe: "" }
        });
    }

    async findPrestataireUsers(idPrestataire: number):Promise<User[]>{
        const users = await this.userRepo.createQueryBuilder("u")
            .innerJoinAndSelect("u.role", "role")
            .innerJoinAndSelect("u.type_utilisateur", "tu")
            .leftJoinAndSelect("u.prestataire", "p")
            .where("u.est_active = :estActive", { estActive: true })
            .andWhere("tu.id_type_utilisateur = :typeUtilisateur", { typeUtilisateur: "TYPE-USER-00002" })
            .andWhere("p.id_prestataire = :idPrestataire", { idPrestataire: idPrestataire })
            .getMany();

        return users.map(user => {
            return { ...user, mot_de_passe: "" }
        });
    }

    async findById(id: number): Promise<User> {
        const user = await this.userRepo.findOne( {
            where: {id_utilisateur: id},
            relations: ["prestataire"]
        });

        if (!user) {
            throw new NotFoundException(`Utilisateur {${id}} introuvable!`)
        }

        return { ...user, mot_de_passe: "" };
    }

    async findByLogin(adresse_mail: string): Promise<User> {
        const user = await this.userRepo.findOne({
            where: {adresse_email: adresse_mail}
        });

        if (!user) {
            throw new NotFoundException(`Utilisateur inexisntant!`)
        }

        return user;
    }

    async delete(id: number): Promise<boolean> {
        const user = await this.findById(id);
        user.est_active = false;

        return this.userRepo.save(user) !== null;
    }

    async activateUser(id: number):Promise<User> {
        if (!id) throw new BadRequestException("L'id de utilisateur est null");

        const temp_user = await this.findById(id);
        if(!temp_user) throw new NotFoundException(`L'utilisateur id:${id} est introuvable`);
        if(temp_user.est_active) throw new BadRequestException("Le compte de cet utilisateur est déjà activé");
        temp_user.est_active = true;

        return this.userRepo.save(temp_user);
    }
}
