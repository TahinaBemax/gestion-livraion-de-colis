import { BadRequestException, Injectable } from "@nestjs/common";
import { CreateLivreurDto } from "src/common/dto/livreur/create-livreur-dto";
import { User } from "../user/user.entity";
import { plainToInstance } from "class-transformer";
import { Livreur } from "./livreur.entity";
import { UserMapper } from "../user/utils/user.mapper";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { CategorieLivreur } from "./categorie-livreur/categorie-livreur.entity";
import { Prestataire } from "../prestataire/prestataire.entity";

@Injectable()
export class LiveurMapper {
    constructor
    (
        private readonly userMapper: UserMapper,
        @InjectRepository(CategorieLivreur)
        private readonly categorieRepo: Repository<CategorieLivreur>        
    ){}

    async prepareData(prestataire: Prestataire, dto: CreateLivreurDto): Promise<Livreur>{
        if (!prestataire?.est_active) {
            throw new BadRequestException("Le prestataire associé n'est pas actif. Impossible de créer un livreur.");
        }

        const user = this.userMapper.mapToLivreur(dto.user, prestataire.id_prestataire);
        const livreur: Livreur = plainToInstance(Livreur, dto);
        const categorie = await this.getCategorieLivreurByIdIfExist(dto.id_categorie_livreur);
        
        livreur.categorie_livreur = categorie;
        livreur.peut_faire_chargement_colis = true;

        user.prestataire = prestataire;
        livreur.user = user;

        return livreur
    }



    private async getCategorieLivreurByIdIfExist(id: string) {
        const categorieLivreur: CategorieLivreur|null = await this.categorieRepo.findOneBy({id_categorie_livreur: id});
        if(!categorieLivreur) throw new BadRequestException(`Utilisateur id:${id} inexistant!`);

        return categorieLivreur;
    }
}