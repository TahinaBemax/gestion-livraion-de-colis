import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { plainToInstance } from 'class-transformer';
import { Repository } from 'typeorm';
import { ContrainteLivraisonEntity } from '../contrainte-livraison/contrainte-livraison.entity';
import { ContrainteJourEntity } from './contrainte-jour.entity';
import { ContrainteJourDto } from 'src/common/dto/contrainte-jour/contrainte-jour-dto';
import { ContrainteJourUpdateDto } from 'src/common/dto/contrainte-jour/contrainte-jour-update-dto';

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

    async update(id: number, dto: ContrainteJourUpdateDto): Promise<ContrainteJourEntity> {
        if(!dto || !id) throw new BadRequestException("Données Invalides");
        const existing = await this.findById(id);

        existing.est_livrable = dto.est_livrable?? existing.est_livrable;
        existing.heure_debut_livraison = dto.heure_debut_livraison?? existing.heure_debut_livraison;
        existing.heure_fin_livraison = dto.heure_fin_livraison?? existing.heure_fin_livraison;
        existing.jour_semaine = dto.jour_semaine?? existing.jour_semaine;   

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
