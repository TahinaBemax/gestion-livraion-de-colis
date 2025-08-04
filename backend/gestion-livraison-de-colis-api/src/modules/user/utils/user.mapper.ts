import { Injectable } from "@nestjs/common";
import { plainToInstance } from "class-transformer";
import { CreateUserDto } from "src/common/dto/create-user-dto";
import { Prestataire } from "src/modules/prestataire/prestataire.entity";
import { Repository } from "typeorm";
import { TypeUtilisateur } from "../type-utilisateur/type-utilisateur.entity";
import { User } from "../user.entity";
import { Role } from "src/modules/role/role.entity";
import { InjectRepository } from "@nestjs/typeorm";
import { parse } from "date-fns";
import * as bcrypt from 'bcrypt';

@Injectable()
export class UserMapper {
  constructor(
    @InjectRepository(Role)
    private readonly roleRepo: Repository<Role>,
    @InjectRepository(TypeUtilisateur)
    private readonly typeRepo: Repository<TypeUtilisateur>,
    @InjectRepository(Prestataire)
    private readonly presRepo: Repository<Prestataire>
  ) {}

  async fromDto(dto: CreateUserDto): Promise<User> {
    const user = plainToInstance(User, dto);
    user.telephone = dto.telephone != null ? dto.telephone.replace(/\s+/g, '') : undefined;
    user.mot_de_passe = await bcrypt.hash(dto.mot_de_passe, 10);

    user.date_naissance = parse(dto.date_naissance.toString(), 'dd/MM/yyyy', new Date());
    user.role = await this.roleRepo.findOneOrFail({ where: { id: dto.role } });
    user.type_utilisateur = await this.typeRepo.findOneOrFail({ where: { id_type_utilisateur: dto.type_utilisateur } });

    if (dto.prestataire) {
      user.prestataire = await this.presRepo.findOneOrFail({ where: { id_prestataire: dto.prestataire } });
    }
    return user;
  }
}
