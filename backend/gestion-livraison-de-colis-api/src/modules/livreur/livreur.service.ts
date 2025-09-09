import { BadRequestException, Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { Livreur } from './livreur.entity';
import { CreateLivreurDto } from 'src/common/dto/livreur/create-livreur-dto';
import { User } from '../user/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { LiveurMapper } from './livreur.mapper';
import { Prestataire } from '../prestataire/prestataire.entity';
import { LivreurUpdateDto } from 'src/common/dto/livreur/update-livreur-dto';

@Injectable()
export class LivreurService {
    constructor(
        @InjectRepository(Livreur)
        private readonly livreurRepo: Repository<Livreur>, 
        @InjectRepository(User)
        private readonly userRepo: Repository<User>,
        @InjectRepository(Prestataire)
        private readonly prestataireRep: Repository<Prestataire>,
        private readonly livreurMapper: LiveurMapper,
    ){}

    async findByUserID(id: number): Promise<Livreur>{
        const matched = await this.livreurRepo.createQueryBuilder("l")
        .innerJoinAndSelect("l.user", "u")
        .innerJoinAndSelect("l.categorie_livreur", "cl")
        .innerJoinAndSelect("l.livreurs_temporaire", "lt")
        .where("u.id_utilisateur = :id", {id})
        .getOne();

        if(!matched) throw new NotFoundException();

        return { ...matched, user: { ...matched.user, mot_de_passe: "" } };
    }

    async create(idPrestataire: number, dto: CreateLivreurDto): Promise<Livreur> {
        if (!dto) throw new BadRequestException("Données Livreur invalides");
        if (!idPrestataire) throw new BadRequestException("L'IdPrestataire est null");
        const queryRunner = this.livreurRepo.manager.connection.createQueryRunner();

        try {
            const prestataire = await this.prestataireRep.findOneBy({id_prestataire: idPrestataire});
            if(!prestataire) throw new NotFoundException(`Prestataire id:${idPrestataire} Introuvable!`);
    
            await queryRunner.connect();
            await queryRunner.startTransaction();


            const livreur = await this.livreurMapper.prepareData(prestataire, dto);
            var savedLivreur = await queryRunner.manager.save(Livreur, livreur);
            
            await queryRunner.commitTransaction();
            return { ...savedLivreur, user: { ...savedLivreur.user, mot_de_passe: "" } };
        } catch (error) {
            await queryRunner.rollbackTransaction();
            throw error;
        } finally {
            await queryRunner.release();
        }
    }

    async findAllLivreurs(): Promise<Livreur[]>{
        const livreurs = await this.livreurRepo.find({relations: ["user"]});

        return livreurs.map( (l) => {
            return { ...l, user: { ...l.user, mot_de_passe: "" }}
        });
    }

    async findAllLivreursByPrestataire(id:number): Promise<Livreur[]>{
        const livreurs = await this.livreurRepo
            .createQueryBuilder('livreur')
            .innerJoinAndSelect('livreur.user', 'user')
            .innerJoin(Prestataire, 'p', 'p.id_prestataire = user.id_prestataire')
            .addSelect('p')
            .where('p.id_prestataire = :id', { id })
            .getMany();

        return livreurs.map( (l) => {
            return { ...l, user: { ...l.user, mot_de_passe: "" }}
        });
    }

    async findById(id:number): Promise<Livreur>{
        const livreur = await this.livreurRepo.findOne({
            where: {id_livreur: id},
            relations: ["user"]
        });

        if(!livreur) throw new NotFoundException(`Livreur id:${id} Introuvable`);
        return livreur;
    }

    async changeAccountStatus(id_prestataire:number, id: number, isActivate:boolean): Promise<{message: string}>{
        const matched = await this.findById(id);
        const prestataire = await matched.user.prestataire;
        if(id_prestataire != prestataire?.id_prestataire) 
            throw new UnauthorizedException("Vous n'avez pas le droit de modifier ce livreur!");

        if(matched.user.est_active !== isActivate){
            matched.user.est_active = isActivate;
            this.userRepo.save(matched.user);
        }

        return {message: `Compte Livreur ${(isActivate) ? 'activé': 'desactivé'} avec succés!`};
    }

    async canScan(id_prestataire:number, id: number, canScan: boolean): Promise<{message: string}>{
        const matched = await this.findById(id);
        const prestataire = matched.user.prestataire;
        if(id_prestataire != prestataire?.id_prestataire) 
            throw new UnauthorizedException("Vous n'avez pas le droit de modifier ce livreur!");

        matched.peut_faire_chargement_colis = canScan;
        this.livreurRepo.save(matched);

        return {message: `Scan au moment du chargement du camion ${(canScan) ? 'activé' : 'desactivé'} avec succés!`};
    }


    async update(idLivreur: number, data: LivreurUpdateDto):Promise<Livreur> {
        if(!data) throw new BadRequestException("Données Livreur invalides");
        if(!idLivreur) throw new BadRequestException("L'id du livreur est null");

        const matched = await this.findById(idLivreur);
        matched.user = {...matched.user, ...data};
        matched.categorie_livreur = data.id_categorie_livreur ? await this.livreurMapper['getCategorieLivreurByIdIfExist'](data.id_categorie_livreur) : matched.categorie_livreur;

        const updated = await this.livreurRepo.save(matched);
        return { ...updated, user: { ...updated.user, mot_de_passe: "" } };
    }
}
