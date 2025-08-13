import { BadRequestException, forwardRef, Inject, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { plainToInstance } from 'class-transformer';
import { ContrainteLivraisonDto } from 'src/common/dto/contrainte-livraison/contrainte-livraison-dto';
import { Repository } from 'typeorm';
import { PointLivraisonService } from '../point-livraison/point-livraison.service';
import { PointLivraisonEntity } from '../point-livraison/point-livraison.entity';
import { ContrainteLivraisonEntity } from './contrainte-livraison.entity';
import { ContrainteJourService } from '../contrainte-jour/contrainte-jour.service';
import { ContrainteJourEntity } from '../contrainte-jour/contrainte-jour.entity';

@Injectable()
export class ContrainteLivraisonService {

    constructor(
        @InjectRepository(ContrainteLivraisonEntity)
        private readonly contrainteLivaisonRep: Repository<ContrainteLivraisonEntity>,
        @Inject(forwardRef(() => PointLivraisonService))
        private readonly pointLivraisonService: PointLivraisonService,
        private readonly contrainteJourService: ContrainteJourService,
    ){}

    async findById(id:number):Promise<ContrainteLivraisonEntity> {
        return this.contrainteLivaisonRep.findOneOrFail({
            where: {id: id},
            relations: ["contrainte_jour_livraisons"]
        });
    }

    async findAll():Promise<ContrainteLivraisonEntity[]> {
        return this.contrainteLivaisonRep.find({
            relations: ["contrainte_jour_livraisons"]
        });
    }

    async save(dto: ContrainteLivraisonDto): Promise<ContrainteLivraisonEntity>{
        if(!dto) throw new BadRequestException("Données Invalides");
        
        const pl = await this.getPointLivraison(dto.id_point_livraison);
        const contrainte: ContrainteLivraisonEntity = plainToInstance(ContrainteLivraisonEntity, dto);
        contrainte.contrainte_jour_livraisons = await this.getContraintesJours(dto.id_contraintes_jour_livraison);
        contrainte.point_livraison =  pl;
        
        const prepare = this.contrainteLivaisonRep.create(contrainte);
        return this.contrainteLivaisonRep.save(prepare);
    }

    async update(id: number, dto: ContrainteLivraisonDto): Promise<ContrainteLivraisonEntity> {
        if (!dto || !id) throw new BadRequestException("Données Invalides");

        const existing = await this.findById(id);
        if (!existing) throw new NotFoundException(`Contrainte Livraison avec id:${id} est introuvable!`);

        const pl = await this.getPointLivraison(dto.id_point_livraison);
        const contrainte: ContrainteLivraisonEntity = plainToInstance(ContrainteLivraisonEntity, dto);
        
        contrainte.contrainte_jour_livraisons = await this.getContraintesJours(dto.id_contraintes_jour_livraison);
        contrainte.point_livraison = pl;

        // Update the existing entity with new values
        Object.assign(existing, contrainte);
        existing.id = id;
        
        return this.contrainteLivaisonRep.save(existing);
    }


    private async getPointLivraison(id: number): Promise<PointLivraisonEntity> {
        const pl = await this.pointLivraisonService.findById(id);
        if(!pl) throw new NotFoundException(`Point de Livraison avec id: ${id} introuvable!`);
        return pl;
    }

    private async getContraintesJours(ids?: number[]): Promise<ContrainteJourEntity[]|undefined> {
        if(!ids) return [];

        return Promise.all(ids.map(id => {
            return this.contrainteJourService.findById(id)
        }));        
    }    

}