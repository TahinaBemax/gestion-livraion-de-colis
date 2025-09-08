import { InjectRepository } from '@nestjs/typeorm';
import { plainToInstance } from 'class-transformer';
import { Repository, In } from 'typeorm';
import { EvenementLocalEntity } from './evenement-local.entity';
import { EvenementLocalDto } from 'src/common/dto/evenement-local/evenement-local-dto';
import { Injectable, NotFoundException } from '@nestjs/common';


@Injectable()
export class EvenementLocalService {
    constructor(
        @InjectRepository(EvenementLocalEntity)
        private readonly evenementLocalRep: Repository<EvenementLocalEntity>,
    ){}

    async findById(id:number):Promise<EvenementLocalEntity> {
        const matched = await this.evenementLocalRep.findOne({
            where: {id: id}
        });

        if(!matched) throw new NotFoundException(`Evenement Local avec id:${id} introuvable`);
        return matched;
    }

    async findAll(): Promise<EvenementLocalEntity[]> {
        return this.evenementLocalRep.find();
    }

    async findByIds(id: number[]): Promise<EvenementLocalEntity[]> {
        return this.evenementLocalRep.findBy({id: In(id)});
    }

    async save(dto: EvenementLocalDto): Promise<EvenementLocalEntity> {
        if(!dto) throw new NotFoundException("Données invalides");

        const animation: EvenementLocalEntity = plainToInstance(EvenementLocalEntity, dto);
        const prepared = this.evenementLocalRep.create(animation);
        return this.evenementLocalRep.save(prepared);
    }

    async update(id: number, dto: EvenementLocalDto): Promise<EvenementLocalEntity> {
        if (!dto || !id) throw new NotFoundException("Données invalides");

        // Fetch existing animation once
        const existingAnimation = await this.findById(id);

        existingAnimation.jour_semaine = dto.jour_semaine;
        existingAnimation.nom_evenement = dto.nom_evenement;
        existingAnimation.date_debut = dto.date_debut;
        existingAnimation.date_fin = dto.date_fin;
        existingAnimation.type_evenement = dto.type_evenement;
        existingAnimation.frequence_evenement = dto.frequence_evenement;

        return this.evenementLocalRep.save(existingAnimation);
    }

    async delete(id: number): Promise<void> {
        if (!id) throw new NotFoundException("ID invalide");

        const animation = await this.findById(id);
        if (!animation) throw new NotFoundException(`Evenement Local avec id:${id} introuvable`);

        await this.evenementLocalRep.remove(animation);
    }
}
