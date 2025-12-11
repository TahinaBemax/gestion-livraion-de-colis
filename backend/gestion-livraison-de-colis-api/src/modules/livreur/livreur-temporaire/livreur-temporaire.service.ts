import { isValid } from 'date-fns';
import { BadRequestException, Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { LivreurTemporaireEntity } from './livreur-temporaire.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Livreur } from '../livreur.entity';
import { LivreurTemporaireDto } from 'src/common/dto/livreur/livreur-temporaire-dto';
import { plainToInstance } from 'class-transformer';
import { parse } from 'date-fns';
import * as bcrypt from 'bcrypt';
import { LivreurTemporaireUpdateDto } from 'src/common/dto/livreur/update-livreur-temporaire-dto';
import { LivreurService } from '../livreur.service';
import { Utils } from 'src/common/utils/utils';

@Injectable()
export class LivreurTemporaireService {
    constructor(
        @InjectRepository(LivreurTemporaireEntity)
        private readonly livreurTempRep: Repository<LivreurTemporaireEntity>,
        private readonly livreurService: LivreurService
    ){}

    async findAll(): Promise<LivreurTemporaireEntity[]>{
        return this.livreurTempRep.find();
    }

    async findById(id: number): Promise<LivreurTemporaireEntity>{
        const matched = await this.livreurTempRep.findOne({where: {id: id}});
        if(!matched || matched === null) throw new NotFoundException("Livreur Temporaire avec ID:{${id}} Introuvable!");

        return matched;
    }

    /**
     * LISTE DES LIVREURS TEMPORAIRE D'UN LIVREUR PONCTUEL
     * @param idUtilisateur 
     * @returns Liste des livreurs temporaire
     */
    async findByLivreurID(idUtilisateur: number): Promise<LivreurTemporaireEntity[]>{
        const user = await this.livreurService.findByUserID(idUtilisateur);

        const matched = await this.livreurTempRep.createQueryBuilder("lt")
        .innerJoinAndSelect("lt.livreur_parent", "l")
        .innerJoinAndSelect("l.user", "user")
        .where("l.id_livreur = :id", {id: user.id_livreur})
        .getMany();

        return matched;
    }

    async save(idLivreur: number, dto: LivreurTemporaireDto): Promise<LivreurTemporaireEntity>{
        if(!dto) throw new BadRequestException("Données livreur tempraire Invalides");

        const existingLiveur = await this.livreurService.findByUserID(idLivreur);

        //Verification du Categorie du livreur
        this.estLivreurPonctuel(existingLiveur);
        
        const livreur_temp = plainToInstance(LivreurTemporaireEntity, dto);

        livreur_temp.livreur_parent = existingLiveur;
        livreur_temp.date_naissance = dto.date_naissance;
        livreur_temp.date_creation = new Date().toISOString();
        livreur_temp.est_active = true;
        livreur_temp.mot_de_passe = Utils.hashPassword(dto.mot_de_passe);
        livreur_temp.telephone = Utils.reformatToPhoneNumber(dto.telephone);

        const prepredDate = this.livreurTempRep.create(livreur_temp);
        const saved = await this.livreurTempRep.save(prepredDate);

        return {...saved, mot_de_passe: ""};
    }

    private estLivreurPonctuel(livreur: Livreur){
        if(livreur.categorie_livreur.id_categorie_livreur !== "CAT-LIVREUR-00002") throw new UnauthorizedException("Seule les livreurs ponctuels peuvent créer un livreur temporaire!");

        return true;
    }


    async update(idLiveurTemp: number, dto: LivreurTemporaireUpdateDto): Promise<LivreurTemporaireEntity>{
        if(!dto) throw new BadRequestException("Données livreur tempraire Invalides");

        const existingLiveurTempo = await this.findById(idLiveurTemp);
        if(!existingLiveurTempo) throw new NotFoundException(`Livreur Temporaire avec ID:{${idLiveurTemp}} introuvable`);

        existingLiveurTempo.nom = dto.nom?? existingLiveurTempo.nom;
        existingLiveurTempo.prenom = dto.prenom?? existingLiveurTempo.prenom;
        existingLiveurTempo.date_naissance = dto.date_naissance?? existingLiveurTempo.date_naissance;
        existingLiveurTempo.date_creation = new Date().toISOString();
        existingLiveurTempo.mot_de_passe = (dto.mot_de_passe) ? Utils.hashPassword(dto.mot_de_passe) : existingLiveurTempo.mot_de_passe;
        existingLiveurTempo.telephone = (dto.telephone) ? Utils.reformatToPhoneNumber(dto.telephone) : existingLiveurTempo.telephone;

        const saved = await this.livreurTempRep.save(existingLiveurTempo);
        return {...saved, mot_de_passe: ""};
    }

    async delete(id: number): Promise<String>{
        const existingLiveurTempo = await this.findById(id);
        if(!existingLiveurTempo) throw new NotFoundException(`Livreur Temporaire avec ID:{${id}} introuvable`);

        existingLiveurTempo.est_active = false;
        this.livreurTempRep.save(existingLiveurTempo);

        return `Liveur Temporaire avec ID:{${id}} desactivé avec succées`;
    }

}
