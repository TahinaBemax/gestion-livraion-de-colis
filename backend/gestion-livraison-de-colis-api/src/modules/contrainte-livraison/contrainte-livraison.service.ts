import { Utils } from 'src/common/utils/utils';
import { BadRequestException, forwardRef, Inject, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { plainToInstance } from 'class-transformer';
import { Repository } from 'typeorm';
import { PointLivraisonService } from '../point-livraison/point-livraison.service';
import { PointLivraisonEntity } from '../point-livraison/point-livraison.entity';
import { ContrainteLivraisonEntity } from './contrainte-livraison.entity';
import { ContrainteJourDto } from 'src/common/dto/contrainte-jour/contrainte-jour-dto';
import { ContrainteLivraisonUpdateDto } from 'src/common/dto/contrainte-livraison/contrainte-livraison-update-dto';

@Injectable()
export class ContrainteLivraisonService {

    constructor(
        @InjectRepository(ContrainteLivraisonEntity)
        private readonly contrainteLivaisonRep: Repository<ContrainteLivraisonEntity>,
        @Inject(forwardRef(() => PointLivraisonService))
        private readonly pointLivraisonService: PointLivraisonService,
    ){}

    async findById(id:number):Promise<ContrainteLivraisonEntity> {
        const matched = await this.contrainteLivaisonRep.findOne({
            where: {id: id},
            relations: ["contrainte_jour_livraisons"]
        });

        if(!matched) throw new BadRequestException(`Contrainte Livraison avec id:${id} est introuvable!`);

        return matched;
    }

    async findAll():Promise<ContrainteLivraisonEntity[]> {
        return this.contrainteLivaisonRep.find({
            relations: ["contrainte_jour_livraisons"]
        });
    }


    async update(id: number, dto: ContrainteLivraisonUpdateDto): Promise<ContrainteLivraisonEntity> {
        if (!dto || !id) throw new BadRequestException("Données Invalides");

        const existing = await this.findById(id);
        existing.intitule_contrainte = dto.intitule_contrainte ?? existing.intitule_contrainte;
        
        if(dto.date_contrainte){
            Utils.isPresentOrFuture(dto.date_contrainte);
            existing.date_contrainte = dto.date_contrainte ?? existing.date_contrainte;
        }
        
        return this.contrainteLivaisonRep.save(existing);
    }


    private async getPointLivraison(id: number): Promise<PointLivraisonEntity> {
        return await this.pointLivraisonService.findById(id);
    }
}