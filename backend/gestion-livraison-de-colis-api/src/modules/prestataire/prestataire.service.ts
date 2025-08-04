import { Injectable, NotFoundException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { Prestataire } from './prestataire.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { PrestataireCreateDto } from 'src/common/dto/prestataire/create-prestataire-dto';
import { plainToInstance } from 'class-transformer';

@Injectable()
export class PrestataireService {
    constructor(
        @InjectRepository(Prestataire)
        private readonly prestataireRepo: Repository<Prestataire>
    ){}

    async create(prestataireCreateDto: PrestataireCreateDto): Promise<Prestataire>{
        const prestatire: Prestataire = plainToInstance(Prestataire, prestataireCreateDto);
        prestatire.telephone = prestatire.telephone?.replaceAll(/\s+/g, '');

        const prepared = this.prestataireRepo.create(prestatire);
        
        return await this.prestataireRepo.save(prepared);
    }

    async findAll():Promise<Prestataire[]> {
        return this.prestataireRepo.find();
    }

    async findById(id:number): Promise<Prestataire> {
        const prestataire = await this.prestataireRepo.findOneBy({ id_prestataire: id})
        if(!prestataire) throw new NotFoundException(`Prestataire id:{${id}} introuvable`);

        return prestataire;
    }

    async desactivate(id:number): Promise<{message: string}> {
        const matchedPrestataire = await this.findById(id);
        matchedPrestataire.est_active = false;

        this.prestataireRepo.save(matchedPrestataire);
        return {message: "Prestatiare désactivé avec succés"};
    }

    async activate(id:number): Promise<{message: string}> {
        const matchedPrestataire = await this.findById(id);
        matchedPrestataire.est_active = true;

        this.prestataireRepo.save(matchedPrestataire);
        return {message: "Prestatiare activé avec succés"};
    }

    async update(prestataire: Prestataire): Promise<Prestataire> {
        const matchedPrestataire = await this.findById(prestataire.id_prestataire);
        matchedPrestataire.telephone = matchedPrestataire.telephone?.replaceAll(/\s+/g, '')

        const prepared = this.prestataireRepo.create(matchedPrestataire);

        return this.prestataireRepo.save(prepared);
    }
}
