import { BadRequestException, Injectable } from "@nestjs/common";
import { plainToInstance } from "class-transformer";
import { CreateUserDto } from "src/common/dto/create-user-dto";
import { Repository } from "typeorm";
import { TypeUtilisateur } from "../type-utilisateur/type-utilisateur.entity";
import { User } from "../user.entity";
import { Role } from "src/modules/role/role.entity";
import { InjectRepository } from "@nestjs/typeorm";
import { format, isValid, parse } from "date-fns";
import * as bcrypt from 'bcrypt';
import { PrestataireService } from "src/modules/prestataire/prestataire.service";
import { Utils } from "src/common/utils/utils";
import { Prestataire } from "src/modules/prestataire/prestataire.entity";
import { UpdateUserDto } from "src/common/dto/update-user-dto";
import { Livreur } from "src/modules/livreur/livreur.entity";

@Injectable()
export class UserMapper {
  constructor(
    @InjectRepository(Role)
    private readonly roleRepo: Repository<Role>,
    @InjectRepository(TypeUtilisateur)
    private readonly typeRepo: Repository<TypeUtilisateur>,
    private readonly presService: PrestataireService
  ) {}

  async fromDtoToUser(dto: CreateUserDto): Promise<User> {
    if(!dto) throw new BadRequestException("Le dto est null");
    
    const role =  new Role();
    const type_utilisateur = new TypeUtilisateur();

    type_utilisateur.id_type_utilisateur = "TYPE-USER-00001"; // Type utilisateur Interne
    role.id = dto.role;

    const user = plainToInstance(User, dto);
    user.adresse_email = dto.email;
    user.mot_de_passe = Utils.hashPassword(dto.mot_de_passe);
    user.role = role;
    user.type_utilisateur = type_utilisateur;

    return user;
  }

  fromDtoWithPrestataire(dto: CreateUserDto, idPrestataire: number): User {
    if(!dto) throw new BadRequestException("Le dto est null");
    if(!idPrestataire) throw new BadRequestException("L'id de prestataire est null");

    const role =  new Role();
    const type_utilisateur = new TypeUtilisateur();
    const prestataire = new Prestataire();

    prestataire.id_prestataire = idPrestataire;
    type_utilisateur.id_type_utilisateur = "TYPE-02"; // Type utilisateur Prestataire
    role.id = dto.role;

    const user = plainToInstance(User, dto);
    user.adresse_email = dto.email;
    user.mot_de_passe = Utils.hashPassword(dto.mot_de_passe);
    user.role = role;
    user.type_utilisateur = type_utilisateur;
    user.prestataire = prestataire;

    return user;
  }

  async mapUpdateUserDtoToUser(user: User, dto: UpdateUserDto): Promise<User> {
    if(!dto) throw new BadRequestException("Le dto est null");

    const role =  new Role();
    role.id = dto.role?? user.role.id;
    user.nom = dto.nom?? user.nom;
    user.prenom = dto.prenom?? user.prenom; 
    user.role = role;

    user.civilite = dto.civilite?? user.civilite;
    user.date_naissance = dto.date_naissance?? user.date_naissance; 
    user.numero_telephone = dto.numero_telephone?? user.numero_telephone;
    user.adresse_email = dto.adresse_email?? user.adresse_email;
    if(dto.photo_profil) user.photo_profil = dto.photo_profil;
    
    return user;
  }

  mapToLivreur(dto: CreateUserDto, idPrestatare?: number): User {
    if(!dto) throw new BadRequestException("Le dto est null");

    const user = this.fromDtoWithPrestataire(dto, idPrestatare?? 0);
    const role =  new Role();
    const type_user = new TypeUtilisateur();
    
    type_user.id_type_utilisateur = "TYPE-USER-00003"; // Type utilisateur Livreur 
    role.id = "ROLE-02"; // Role Livreur

    user.role = role;
    user.type_utilisateur = type_user;
    user.prestataire = undefined
    
    return user;
  }
}
