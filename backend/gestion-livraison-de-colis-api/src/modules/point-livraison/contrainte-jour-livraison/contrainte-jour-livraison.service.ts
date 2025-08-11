import { Injectable } from '@nestjs/common';
import { ContrainteJourLivraison } from './contrainte-jour-livraison.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class ContrainteJourLivraisonService {
    constructor(
        @InjectRepository(ContrainteJourLivraison)
        private readonly contrainteJourRepo: Repository<ContrainteJourLivraison>
    ){}

    async findById(id: number): Promise<ContrainteJourLivraison> {
        return this.contrainteJourRepo.findOneOrFail({
            where: {id_contrainte_jour_livraison: id}
        });
    }
}
