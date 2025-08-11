import { BadRequestException, Inject, forwardRef} from '@nestjs/common';
import { Injectable, NotFoundException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { ContrainteLivraison } from './contrainte-livraison.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { ContrainteLivraisonDto } from 'src/common/dto/contrainte-livraison/contrainte-livraison-dto';
import { plainToInstance } from 'class-transformer';
import { PointLivraisonService } from '../point-livraison.service';
import { PointLivraison } from '../point-livraison.entity';
import { ContrainteJourLivraison } from '../contrainte-jour-livraison/contrainte-jour-livraison.entity';
import { ContrainteJourLivraisonService } from '../contrainte-jour-livraison/contrainte-jour-livraison.service';

@Injectable()
export class ContrainteLivraisonService {

    constructor(
        @InjectRepository(ContrainteLivraison)
        private readonly contrainteLivaisonRep: Repository<ContrainteLivraison>,
        @Inject(forwardRef(() => PointLivraisonService))
        private readonly pointLivraisonService: PointLivraisonService,
        private readonly contrainteJourService: ContrainteJourLivraisonService,
    ){}

    async findById(id:number):Promise<ContrainteLivraison> {
        return this.contrainteLivaisonRep.findOneOrFail({
            where: {id_contrainte_livraison: id},
            relations: ["contrainte_jour_livraisons"]
        });
    }

    async findAll():Promise<ContrainteLivraison[]> {
        return this.contrainteLivaisonRep.find({
            relations: ["contrainte_jour_livraisons"]
        });
    }

    async save(dto: ContrainteLivraisonDto): Promise<ContrainteLivraison>{
        if(!dto) throw new BadRequestException("Données Invalides");
        
        const pl = await this.getPointLivraison(dto.id_point_livraison);
        const contrainte: ContrainteLivraison = plainToInstance(ContrainteLivraison, dto);
        contrainte.contrainte_jour_livraisons = await this.getContraintesJoursLivraisons(dto.id_contraintes_jour_livraison);
        contrainte.point_livraison =  pl;
        
        const prepare = this.contrainteLivaisonRep.create(contrainte);
        return this.contrainteLivaisonRep.save(prepare);
    }

    async update(id: number, dto: ContrainteLivraisonDto):Promise<ContrainteLivraison>{
        const existing = await this.findById(id);
        if (!existing) throw new NotFoundException("Contrainte Livraison avec id:${id} est introuvable!");

        return this.save(dto);
    }


    private async getPointLivraison(id: number): Promise<PointLivraison> {
        const pl = await this.pointLivraisonService.findById(id);
        if(!pl) throw new NotFoundException(`Point de Livraison avec id: ${id} introuvable!`);
        return pl;
    }

    private async getContraintesJoursLivraisons(ids?: number[]): Promise<ContrainteJourLivraison[]|undefined> {
        if(!ids) return ids;

        return Promise.all(ids.map(id => {
            return this.contrainteJourService.findById(id)
        }));        
    }    
}
