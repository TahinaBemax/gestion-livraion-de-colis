import { BadRequestException, Injectable } from "@nestjs/common";
import { CreateLivreurDto } from "src/common/dto/livreur/create-livreur-dto";
import { User } from "../user/user.entity";
import { plainToInstance } from "class-transformer";
import { Livreur } from "./livreur.entity";
import { UserMapper } from "../user/utils/user.mapper";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { CategorieLivreur } from "./categorie-livreur/categorie-livreur.entity";

@Injectable()
export class LiveurMapper {
    constructor
    (
        private readonly userMapper: UserMapper,
        @InjectRepository(CategorieLivreur)
        private readonly categorieRepo: Repository<CategorieLivreur>        
    ){}

    async prepareData(dto: CreateLivreurDto): Promise<{user: User, livreur: Livreur}>{
        const user = await this.userMapper.fromDto(dto.user);
        const livreur: Livreur = plainToInstance(Livreur, dto);
        const categorie = await this.getCategorieLivreurByIdIfExist(dto.id_categorie_livreur);
        
        livreur.categorie_livreur = categorie;
        livreur.peut_faire_chargement_colis = dto.peut_faire_chargement_colis?? false;
        livreur.total_points = 0;
        livreur.rang_global = 0;
        livreur.total_livraison_effectue = 0;

        return {user, livreur}
    }



    private async getCategorieLivreurByIdIfExist(id: string) {
        const categorieLivreur: CategorieLivreur = await this.categorieRepo.findOneByOrFail({id_categorie_livreur: id});
        if(!categorieLivreur) throw new BadRequestException(`Utilisateur id:${id} Introuvable!`);

        return categorieLivreur;
    }
}