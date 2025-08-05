import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { ContrainteLivraison } from './contrainte-livraison.entity';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class ContrainteLivraisonService {

    constructor(
        @InjectRepository(ContrainteLivraison)
        private readonly contrainteLivaisonRep: Repository<ContrainteLivraison>
    ){}

    async findById(id:number):Promise<ContrainteLivraison> {
        return this.contrainteLivaisonRep.findOneOrFail({
            where: {id_contrainte_livraison: id},
            relations: ["contrainte_jour_livraisons"]
        });
    }
}
