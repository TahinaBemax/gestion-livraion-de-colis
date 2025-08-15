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

@Injectable()
export class UserMapper {
  constructor(
    @InjectRepository(Role)
    private readonly roleRepo: Repository<Role>,
    @InjectRepository(TypeUtilisateur)
    private readonly typeRepo: Repository<TypeUtilisateur>,
    private readonly presService: PrestataireService
  ) {}

  async fromDto(dto: CreateUserDto): Promise<User> {
    const parsed = parse(dto.date_naissance, 'dd/MM/yyyy', new Date());
    const isValidDate = isValid(parsed) && format(parsed, 'dd/MM/yyyy') === dto.date_naissance;
          
    if (!isValidDate) {
        throw new BadRequestException(`Le format de la date de naissance doit être en dd/MM/yyyy. Valeur reçue: ${dto.date_naissance}`);
    }

    const user = plainToInstance(User, dto);
    user.telephone = dto.telephone != null ? dto.telephone.replace(/\s+/g, '') : undefined;
    user.mot_de_passe = await bcrypt.hash(dto.mot_de_passe, 10);

    user.date_naissance = parsed;
    user.role = await this.roleRepo.findOneOrFail({ where: { id: dto.role } });
    user.type_utilisateur = await this.typeRepo.findOneOrFail({ where: { id_type_utilisateur: dto.type_utilisateur } });

    if (dto.prestataire) {
      user.prestataire = Promise.resolve(await this.presService.findById(dto.prestataire));
    }
    return user;
  }
}
