import { BadRequestException, Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { Livreur } from './livreur.entity';
import { plainToInstance } from 'class-transformer';
import { CreateLivreurDto } from 'src/common/dto/livreur/create-livreur-dto';
import { User } from '../user/user.entity';
import { CategorieLivreur } from './categorie-livreur/categorie-livreur.entity';

@Injectable()
export class LivreurService {
    constructor(
        private readonly livreurRepo: Repository<Livreur>, 
        private readonly userRepo: Repository<User>,
        private readonly categorieRepo: Repository<CategorieLivreur>
    ){}

    async create(dto: CreateLivreurDto): Promise<Livreur> {
        const livreur: Livreur = plainToInstance(Livreur, dto);

        const user = await this.getUserByIdIfExist(dto.id_utilisateur);
        const categorie = await this.getCategorieLivreurByIdIfExist(dto.id_categorie_livreur);
        
        livreur.categorie_livreur = categorie;
        livreur.user = user;

        const prepared = this.livreurRepo.create(livreur);
        return this.livreurRepo.save(prepared);
    }

    async findAllLivreurs(): Promise<Livreur[]>{
        return this.livreurRepo.find({relations: ["user"]});
    }

    async findById(id:number): Promise<Livreur>{
        const livreur = await this.livreurRepo.findOne({
            where: {id_livreur: id},
            relations: ["user"]
    });

        if(!livreur) throw new NotFoundException(`Livreur id:${id} Introuvable`);
        return livreur;
    }

    async desactivateAccount(id_prestataire:number, id: number): Promise<{message: string}>{
        const matched = await this.findById(id);
        if(id_prestataire !== matched.user.prestataire?.id_prestataire) 
            throw new UnauthorizedException("Vous n'avez pas le droit de modifier ce livreur!");

        if(matched.user.est_active){
            matched.user.est_active = false;
            this.userRepo.save(matched.user);
        }

        return {message: "Compte Livreur désactivé avec succés!"};
    }

    async activateAccount(id_prestataire:number, id: number): Promise<{message: string}>{
        const matched = await this.findById(id);
        if(id_prestataire !== matched.user.prestataire?.id_prestataire) 
            throw new UnauthorizedException("Vous n'avez pas le droit de modifier ce livreur!");

        if(!matched.user.est_active){
            matched.user.est_active = true;
            this.userRepo.save(matched.user);
        }

        return {message: "Compte Livreur désactivé avec succés!"};
    }

    async update(id_prestataire: number, livreur: Livreur):Promise<Livreur> {
        const matched = await this.findById(livreur.id_livreur);

        if(id_prestataire !== matched.user.prestataire?.id_prestataire) 
            throw new BadRequestException("Vous n'avez pas le droit de modifier ce livreur!");

        const prepared = this.livreurRepo.create(livreur);
        return this.livreurRepo.save(prepared);
    }


    private async getUserByIdIfExist(id: number) {
        const user: User = await this.userRepo.findOneByOrFail({id_utilisateur: id});
        if(!user) throw new BadRequestException(`Utilisateur id:${id} Introuvable!`);

        return user;
    }

    private async getCategorieLivreurByIdIfExist(id: string) {
        const categorieLivreur: CategorieLivreur = await this.categorieRepo.findOneByOrFail({id_categorie_livreur: id});
        if(!categorieLivreur) throw new BadRequestException(`Utilisateur id:${id} Introuvable!`);

        return categorieLivreur;
    }
}
