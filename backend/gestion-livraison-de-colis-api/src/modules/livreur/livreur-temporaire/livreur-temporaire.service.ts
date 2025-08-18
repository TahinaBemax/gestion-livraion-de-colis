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

@Injectable()
export class LivreurTemporaireService {
    constructor(
        @InjectRepository(LivreurTemporaireEntity)
        private readonly livreurTempRep: Repository<LivreurTemporaireEntity>,
        @InjectRepository(Livreur)
        private readonly livreurRep: Repository<Livreur>
    ){}

    async findAll(): Promise<LivreurTemporaireEntity[]>{
        return this.livreurTempRep.find();
    }

    async findAllByDeliveryID(id: number): Promise<LivreurTemporaireEntity[]>{
        return this.livreurTempRep.createQueryBuilder("lt")
        .leftJoinAndSelect("lt.liveur_parent", "lp")
        .where("lp.id_livreur = :id", {id})
        .getMany();
    }

    async findById(id: number): Promise<LivreurTemporaireEntity>{
        const matched = await this.livreurTempRep.findOne({where: {id: id}});
        if(!matched || matched === null) throw new NotFoundException("Livreur Temporaire avec ID:{${id}} Introuvable!");

        return matched;
    }

    async save(idLivreur: number, dto: LivreurTemporaireDto): Promise<LivreurTemporaireEntity>{
        if(!dto) throw new BadRequestException("Données livreur tempraire Invalides");

        const existingLiveur = await this.livreurRep.findOneBy({id_livreur: idLivreur});
        if(!existingLiveur) throw new NotFoundException(`Livreur avec ID:{${idLivreur}} introuvable`);

        //Verification du Categorie du livreur
        this.estLivreurPonctuel(existingLiveur);
        
        const livreur_temp = plainToInstance(LivreurTemporaireEntity, dto);
        const date_naissance = parse(dto.date_naissance, "dd/MM/yyyy", new Date());

        if(!date_naissance) throw new BadRequestException("Date de naissance invalide!");

        livreur_temp.livreur_parent = existingLiveur;
        livreur_temp.date_naissance = date_naissance;
        livreur_temp.date_creation = new Date();
        livreur_temp.est_active = true;
        livreur_temp.mot_de_passe = bcrypt.hashSync(dto.mot_de_passe, 10);
        livreur_temp.telephone = dto.telephone.replaceAll(/\s+/g, "");

        const prepredDate = this.livreurTempRep.create(livreur_temp);
        return this.livreurTempRep.save(prepredDate);
    }

    private estLivreurPonctuel(livreur: Livreur){
        if(livreur.categorie_livreur.id_categorie_livreur !== "CAT-LIVREUR-00002") throw new UnauthorizedException("Seule les livreurs ponctuels peuvent créer un livreur temporaire!");

        return true;
    }


    async update(idLivreur: number, idLiveurTemp: number, dto: LivreurTemporaireUpdateDto): Promise<LivreurTemporaireEntity>{
        if(!dto) throw new BadRequestException("Données livreur tempraire Invalides");

        const existingLiveurTempo = await this.findById(idLiveurTemp);
        if(!existingLiveurTempo) throw new NotFoundException(`Livreur Temporaire avec ID:{${idLiveurTemp}} introuvable`);

        const existingLiveur = await this.livreurRep.findOneBy({id_livreur: idLivreur});
        if(!existingLiveur) throw new NotFoundException(`Livreur avec ID:{${idLivreur}} introuvable`);

        const date_naissance = (dto.date_naissance) ? parse(dto.date_naissance, "dd/MM/yyyy", new Date()): existingLiveurTempo.date_naissance;

        if(!isValid(date_naissance)) throw new BadRequestException("Date de naissance invalide!");

        existingLiveurTempo.livreur_parent = existingLiveur;
        existingLiveurTempo.date_naissance = date_naissance;
        existingLiveurTempo.date_creation = new Date();
        existingLiveurTempo.mot_de_passe = (dto.mot_de_passe) ? bcrypt.hashSync(dto.mot_de_passe, 10) : existingLiveurTempo.mot_de_passe;
        existingLiveurTempo.telephone = (dto.telephone) ? dto.telephone.replaceAll(/\s+/g, ""): existingLiveurTempo.telephone;

        const prepredDate = this.livreurTempRep.create(existingLiveurTempo);
        return this.livreurTempRep.save(prepredDate);
    }

    async delete(id: number): Promise<String>{
        const existingLiveurTempo = await this.findById(id);
        if(!existingLiveurTempo) throw new NotFoundException(`Livreur Temporaire avec ID:{${id}} introuvable`);

        existingLiveurTempo.est_active = false;
        this.livreurTempRep.save(existingLiveurTempo);

        return `Liveur Temporaire avec ID:{${id}} desactivé avec succées`;
    }

}
