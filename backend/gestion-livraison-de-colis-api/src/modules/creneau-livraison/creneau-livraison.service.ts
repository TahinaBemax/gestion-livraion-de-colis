import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreneauLivraisonEntity } from './creneau-livraison.entity';
import { CreateCreneauLivraisonDto } from 'src/common/dto/creneau-livraison/create-creneau-livraison-dto';
import { UpdateCreneauLivraisonDto } from 'src/common/dto/creneau-livraison/update-creneau-livraison-dto';
import { plainToInstance } from 'class-transformer';
import { PointLivraisonEntity } from '../point-livraison/point-livraison.entity';

@Injectable()
export class CreneauLivraisonService {
    constructor(
        @InjectRepository(CreneauLivraisonEntity)
        private readonly creneauLivraisonRep: Repository<CreneauLivraisonEntity>,
        @InjectRepository(PointLivraisonEntity)
        private readonly pointLivraisonRep: Repository<PointLivraisonEntity>
    ) {}

    async save(dto: CreateCreneauLivraisonDto): Promise<CreneauLivraisonEntity> {
        const creneauLivraison: CreneauLivraisonEntity = plainToInstance(CreneauLivraisonEntity, dto);
        const existingPL: PointLivraisonEntity|null = await this.pointLivraisonRep.findOneBy({ id: dto.id_point_livraison });

        if(!existingPL) throw new NotFoundException(`Point de Livraison avec ID:${dto.id_point_livraison} est introuvable`);
        
        creneauLivraison.point_livraison = existingPL;
        const prepared = this.creneauLivraisonRep.create(creneauLivraison);
        return this.creneauLivraisonRep.save(prepared);
    }

    async findAll(): Promise<CreneauLivraisonEntity[]> {
        return this.creneauLivraisonRep.find({
            relations: ["point_livraison"]
        });
    }

    async findById(id: number): Promise<CreneauLivraisonEntity> {
        const creneau = await this.creneauLivraisonRep.findOne({
            where: { id: id },
            relations: ["point_livraison"]
        });

        if (!creneau) {
            throw new NotFoundException(`Créneau de livraison avec l'ID ${id} introuvable!`);
        }

        return creneau;
    }

    async findByPointLivraison(idPointLivraison: number): Promise<CreneauLivraisonEntity[]> {
        return this.creneauLivraisonRep.find({
            where: { point_livraison: { id: idPointLivraison } },
            relations: ["point_livraison"]
        });
    }

    async findByAnnee(annee: number): Promise<CreneauLivraisonEntity[]> {
        return this.creneauLivraisonRep.find({
            where: { annee: annee },
            relations: ["point_livraison"]
        });
    }

    async findByJourSemaine(jourSemaine: string): Promise<CreneauLivraisonEntity[]> {
        return this.creneauLivraisonRep.find({
            where: { jour_semaine: jourSemaine },
            relations: ["point_livraison"]
        });
    }

    async update(id: number, dto: UpdateCreneauLivraisonDto): Promise<CreneauLivraisonEntity> {
        const existingCreneau = await this.findById(id);
        
        if (!existingCreneau) {
            throw new NotFoundException(`Créneau de livraison avec l'ID ${id} introuvable!`);
        }

        const creneauLivraison: CreneauLivraisonEntity = plainToInstance(CreneauLivraisonEntity, dto);
        creneauLivraison.id = creneauLivraison.id ?? id;

        const existingPL: PointLivraisonEntity|null = await this.pointLivraisonRep.findOneBy({ id: dto.id_point_livraison });
        if(!existingPL) throw new NotFoundException(`Point de Livraison avec ID:${dto.id_point_livraison} est introuvable`);
        
        creneauLivraison.point_livraison = existingPL;

        return this.creneauLivraisonRep.save(creneauLivraison);
    }

    async delete(id: number): Promise<{ message: string }> {
        const existingCreneau = await this.findById(id);
        
        if (!existingCreneau) {
            throw new NotFoundException(`Créneau de livraison avec l'ID ${id} introuvable!`);
        }

        await this.creneauLivraisonRep.remove(existingCreneau);
        return { message: "Créneau de livraison supprimé avec succès!" };
    }

    async deleteByPointLivraison(idPointLivraison: number): Promise<{ message: string }> {
        const creneaux = await this.findByPointLivraison(idPointLivraison);
        
        if (creneaux.length > 0) {
            await this.creneauLivraisonRep.remove(creneaux);
        }
        
        return { message: `${creneaux.length} créneau(x) de livraison supprimé(s) avec succès!` };
    }
}
