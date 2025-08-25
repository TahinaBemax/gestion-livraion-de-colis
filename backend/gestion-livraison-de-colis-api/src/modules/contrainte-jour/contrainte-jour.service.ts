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

        const contrainteLivrasion = await this.getContrainteLivraison(dto.id_contrainte_livraison);

        const temp = plainToInstance(ContrainteJourEntity, dto);
        temp.contrainte_livraison = contrainteLivrasion;

        const prepared = this.contrainteJourRepo.create(temp);
        return this.contrainteJourRepo.save(prepared);
    }

    async update(id: number, dto: ContrainteJourDto): Promise<ContrainteJourEntity> {
        if(!dto || !id) throw new BadRequestException("Données Invalides");
        const existing = await this.findById(id);
        (!dto.id) ? id : dto.id;

        const contrainteLivrasion = await this.getContrainteLivraison(dto.id_contrainte_livraison);
        existing.est_livrable = dto.est_livrable;
        existing.heure_debut_livraison = dto.heure_debut_livraison;
        existing.heure_fin_livraison = dto.heure_fin_livraison;
        existing.jour_semaine = dto.jour_semaine;   
        existing.contrainte_livraison = contrainteLivrasion;

        return this.contrainteJourRepo.save(existing);
    }


    private async getContrainteLivraison(id: number): Promise<ContrainteLivraisonEntity> {
        const cl = await this.contrainteLivraisonEntityRep.findOne({
            where: {id: id}
        })
        if(cl == null) throw new BadRequestException("Contrainte de Livraison Inexistante");

        return cl;
    }
}
