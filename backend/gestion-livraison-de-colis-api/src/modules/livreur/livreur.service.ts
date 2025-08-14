import { BadRequestException, Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { Livreur } from './livreur.entity';
import { CreateLivreurDto } from 'src/common/dto/livreur/create-livreur-dto';
import { User } from '../user/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { LiveurMapper } from './livreur.mapper';

@Injectable()
export class LivreurService {
    constructor(
        @InjectRepository(Livreur)
        private readonly livreurRepo: Repository<Livreur>, 
        @InjectRepository(User)
        private readonly userRepo: Repository<User>,
        private readonly livreurMapper: LiveurMapper
    ){}

    async create(dto: CreateLivreurDto): Promise<Livreur> {
        const preparedData = this.livreurMapper.prepareData(dto);
        const user = (await preparedData).user;
        const prestataire = await user.prestataire;
        
        if(!prestataire?.est_active) throw new BadRequestException("Compte Prestataire désactivé ne peut pas créer un Livreur!");
        
        const livreur = (await preparedData).livreur; 
        livreur.user = user;

        const prepared = this.livreurRepo.create(livreur);
        return this.livreurRepo.save(prepared);
    }

    async findAllLivreurs(): Promise<Livreur[]>{
        return this.livreurRepo.find({relations: ["user"]});
    }

    async findAllLivreursByPrestataire(id:number): Promise<Livreur[]>{
        return this.livreurRepo
            .createQueryBuilder('livreur')
            .leftJoinAndSelect('livreur.user', 'user')
            .leftJoinAndSelect('user.prestataire', 'prestataire')
            .where('prestataire.id_prestataire = :id', { id })
            .getMany();
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
        const prestataire = await matched.user.prestataire;
        if(id_prestataire != prestataire?.id_prestataire) 
            throw new UnauthorizedException("Vous n'avez pas le droit de modifier ce livreur!");

        if(matched.user.est_active){
            matched.user.est_active = false;
            this.userRepo.save(matched.user);
        }

        return {message: "Compte Livreur désactivé avec succés!"};
    }

    async activateAccount(id_prestataire:number, id: number): Promise<{message: string}>{
        const matched = await this.findById(id);
        const prestataire = await matched.user.prestataire;
        if(id_prestataire != prestataire?.id_prestataire) 
            throw new UnauthorizedException("Vous n'avez pas le droit de modifier ce livreur!");

        if(!matched.user.est_active){
            matched.user.est_active = true;
            this.userRepo.save(matched.user);
        }

        return {message: "Compte Livreur activé avec succés!"};
    }

    async update(id_prestataire: number, livreur: Livreur):Promise<Livreur> {
        const matched = await this.findById(livreur.id_livreur);

        if(id_prestataire !== (await matched.user.prestataire)?.id_prestataire) 
            throw new BadRequestException("Vous n'avez pas le droit de modifier ce livreur!");

        const prepared = this.livreurRepo.create(livreur);
        return this.livreurRepo.save(prepared);
    }

    private async getUserByIdIfExist(id: number) {
        const user: User = await this.userRepo.findOneByOrFail({id_utilisateur: id});
        if(!user) throw new BadRequestException(`Utilisateur id:${id} Introuvable!`);

        return user;
    }
}
