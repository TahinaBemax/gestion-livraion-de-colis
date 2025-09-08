import { Injectable, NotFoundException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { Prestataire } from './prestataire.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { PrestataireCreateDto } from 'src/common/dto/prestataire/create-prestataire-dto';
import { plainToInstance } from 'class-transformer';
import { User } from '../user/user.entity';
import { Role } from '../role/role.entity';
import { TypeUtilisateur } from '../user/type-utilisateur/type-utilisateur.entity';
import { Utils } from 'src/common/utils/utils';
import { PrestataireUpdateDto } from 'src/common/dto/prestataire/update-prestataire-dto';

@Injectable()
export class PrestataireService {
    constructor(
        @InjectRepository(Prestataire)
        private readonly prestataireRepo: Repository<Prestataire>,
        @InjectRepository(User)
        private readonly userRepo: Repository<User>
    ){}

    async create(prestataireCreateDto: PrestataireCreateDto): Promise<Prestataire>{
        const prestatire: Prestataire = this.mapDtoToPrestataire(prestataireCreateDto);
        const prepared = this.prestataireRepo.create(prestatire);
        return await this.prestataireRepo.save(prepared);
    }

    async findAll():Promise<Prestataire[]> {
        return this.prestataireRepo.find();
    }

    async findReponsableExploitation(idPrestataire: number):Promise<User[]> {
        return this.userRepo.createQueryBuilder('user')
            .leftJoinAndSelect('user.role', 'role')
            .leftJoinAndSelect('user.prestataire', 'prestataire')
            .where('prestataire.id_prestataire = :id', { id: idPrestataire })
            .andWhere('role.id_role = :roleId', { roleId: 'ROLE-03' })
            .getMany();
    }

    async filterBy(nom?: string, prenom?: string, nomEntreprise?: string): Promise<Prestataire[]> {
            const queryBuilder = this.prestataireRepo.createQueryBuilder('prestataire')
                .leftJoinAndSelect('prestataire.users', 'user')
    
            if (nom) {
                queryBuilder.andWhere('user.nom ILIKE :nom', { nom: `%${nom}%` });
            }
    
            if (prenom) {
                queryBuilder.andWhere('user.prenom ILIKE :prenom', { prenom: `%${prenom}%` });
            }
    
            if (nomEntreprise) {
                queryBuilder.andWhere('prestataire.nom_entreprise ILIKE :nomEntreprise', { nomEntreprise: `%${nomEntreprise}%` });
            }
    
            return await queryBuilder.getMany();
    }

    async findById(id:number): Promise<Prestataire> {
        const prestataire = await this.prestataireRepo.findOneBy({ id_prestataire: id})
        if(!prestataire) throw new NotFoundException(`Prestataire id:{${id}} introuvable`);

        return prestataire;
    }

    async desactivate(id:number): Promise<{message: string}> {
        const matchedPrestataire = await this.findById(id);
        matchedPrestataire.est_active = false;

        this.prestataireRepo.save(matchedPrestataire);
        return {message: "Prestatiare désactivé avec succés"};
    }

    async activate(id:number): Promise<{message: string}> {
        const matchedPrestataire = await this.findById(id);
        matchedPrestataire.est_active = true;

        this.prestataireRepo.save(matchedPrestataire);
        return {message: "Prestatiare activé avec succés"};
    }

    async update(id: number, dto: PrestataireUpdateDto): Promise<Prestataire> {
        const matched = await this.findById(id);

        matched.nom_entreprise = dto.nom_entreprise?? matched.nom_entreprise; 
        matched.nif = dto.nif?? matched.nif;
        matched.stat = dto.stat?? matched.stat;
        matched.adresse_principale = dto.adresse_principale?? matched.adresse_principale;
        matched.adresse_complementaire = dto.adresse_complementaire;
        matched.departement = dto.departement;
        matched.etat = dto.etat;
        matched.ville = dto.ville;
        matched.pays = dto.pays;
        matched.code_postal = dto.code_postal;
        matched.adresse_email = dto.adresse_email?? matched.adresse_email;
        matched.nom_image_logo = dto.nom_image_logo;
        matched.numero_telephone = matched.numero_telephone?.replaceAll(/\s+/g, '')

        return this.prestataireRepo.save(matched);
    }

    private mapDtoToPrestataire(dto: PrestataireCreateDto): Prestataire {
        const prestataire = new Prestataire();

        prestataire.nom_entreprise = dto.nom_entreprise; 
        prestataire.nif = dto.nif;
        prestataire.stat = dto.stat;
        prestataire.adresse_principale = dto.adresse_principale;
        prestataire.numero_telephone = Utils.reformatToPhoneNumber(dto.numero_telephone);
        prestataire.adresse_email = dto.adresse_email;
        prestataire.nom_image_logo = dto.nom_image_logo;
        prestataire.est_active = true;

        prestataire.users = [this.mapDtoToUser(dto)];

        return prestataire;
    }

    private mapDtoToUser(dto: PrestataireCreateDto): User {
        const user = new User();
        const role = new Role();
        const typeUtilisateur = new TypeUtilisateur();

        user.nom = dto.user.nom;
        user.prenom = dto.user.prenom;
        user.numero_telephone = Utils.reformatToPhoneNumber(dto.user.telephone);
        user.adresse_email = dto.user.email;
        user.mot_de_passe = Utils.hashPassword(dto.user.mot_de_passe);
        user.est_active = true;
        user.photo_profil = undefined;
        
        typeUtilisateur.id_type_utilisateur = 'TYPE-USER-00002'; // Default type for Prestataire
        user.type_utilisateur = typeUtilisateur;

        role.id = 'ROLE-01'; // Admin
        user.role = role;
        return user;
    }
}
