import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { plainToInstance } from 'class-transformer';
import { Repository } from 'typeorm';
import { ContrainteLivraisonEntity } from '../contrainte-livraison/contrainte-livraison.entity';
import { ContrainteJourEntity } from './contrainte-jour.entity';
import { ContrainteJourDto } from 'src/common/dto/contrainte-jour/contrainte-jour-dto';

@Injectable()
export class ContrainteJourService {
    constructor(
        @InjectRepository(ContrainteJourEntity)
        private readonly contrainteJourRepo: Repository<ContrainteJourEntity>,
        @InjectRepository(ContrainteLivraisonEntity)
        private readonly contrainteLivraisonEntityRep: Repository<ContrainteLivraisonEntity>,
    ){}

    async findById(id: number): Promise<ContrainteJourEntity> {
        return this.contrainteJourRepo.findOneOrFail({
            where: {id: id},
            relations: ["contrainte_livraison"]
        });
    }

    async findAll(): Promise<ContrainteJourEntity[]> {
        return this.contrainteJourRepo.find({relations: ["contrainte_livraison"]});
    }

    async save(dto: ContrainteJourDto): Promise<ContrainteJourEntity> {
        if(!dto) throw new BadRequestException("Données Invalides");

        const contrainteLivrasion = await this.contrainteLivraisonEntityRep.findOneOrFail({
            where: {id: dto.id_contrainte_livraison}
        });

        const temp = plainToInstance(ContrainteJourEntity, dto);
        temp.contrainte_livraison = contrainteLivrasion;

        const prepared = this.contrainteJourRepo.create(temp);
        return this.contrainteJourRepo.save(prepared);
    }

    async update(id: number, dto: ContrainteJourDto): Promise<ContrainteJourEntity> {
        if(!dto || !id) throw new BadRequestException("Données Invalides");
        const existing = await this.findById(id);
        (!dto.id) ? id : dto.id;

        const contrainteLivrasion = await this.contrainteLivraisonEntityRep.findOneOrFail({
            where: {id: dto.id_contrainte_livraison}
        });

        const temp = plainToInstance(ContrainteJourEntity, dto);
        temp.contrainte_livraison = contrainteLivrasion;

        Object.assign(existing, temp);
        return this.contrainteJourRepo.save(existing);
    }


}
