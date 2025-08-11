import { BadRequestException, Injectable } from '@nestjs/common';
import { ContrainteJourLivraison } from './contrainte-jour-livraison.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ContrainteLivraison } from '../contrainte-livraison/contrainte-livraison.entity';
import { ContrainteJourLivraisonDto } from 'src/common/dto/contrainte-jour-livraison/contrainte-jour-livraison-dto';
import { plainToInstance } from 'class-transformer';

@Injectable()
export class ContrainteJourLivraisonService {
    constructor(
        @InjectRepository(ContrainteJourLivraison)
        private readonly contrainteJourRepo: Repository<ContrainteJourLivraison>,
        @InjectRepository(ContrainteLivraison)
        private readonly contrainteLivraisonRep: Repository<ContrainteLivraison>,
    ){}

    async findById(id: number): Promise<ContrainteJourLivraison> {
        return this.contrainteJourRepo.findOneOrFail({
            where: {id_contrainte_jour_livraison: id},
            relations: ["contrainte_livraison"]
        });
    }

    async findAll(): Promise<ContrainteJourLivraison[]> {
        return this.contrainteJourRepo.find({relations: ["contrainte_livraison"]});
    }

    async save(dto: ContrainteJourLivraisonDto): Promise<ContrainteJourLivraison> {
        if(!dto) throw new BadRequestException("Données Invalides");

        const contrainteLivrasion = await this.contrainteLivraisonRep.findOneOrFail({
            where: {id_contrainte_livraison: dto.id_contrainte_livraison}
        });

        const temp = plainToInstance(ContrainteJourLivraison, dto);
        temp.contrainte_livraison = contrainteLivrasion;

        const prepared = this.contrainteJourRepo.create(temp);
        return this.contrainteJourRepo.save(prepared);
    }

    async update(id: number, dto: ContrainteJourLivraisonDto): Promise<ContrainteJourLivraison> {
        if(!dto || !id) throw new BadRequestException("Données Invalides");
        const existing = await this.findById(id);
        (!dto.id_contrainte_jour_livraison) ? id : dto.id_contrainte_jour_livraison;

        const contrainteLivrasion = await this.contrainteLivraisonRep.findOneOrFail({
            where: {id_contrainte_livraison: dto.id_contrainte_livraison}
        });

        const temp = plainToInstance(ContrainteJourLivraison, dto);
        temp.contrainte_livraison = contrainteLivrasion;

        Object.assign(existing, temp);
        return this.contrainteJourRepo.save(existing);
    }


}
