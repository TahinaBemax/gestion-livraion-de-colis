import { BadRequestException, forwardRef, Inject, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { plainToInstance } from 'class-transformer';
import { ContrainteLivraisonDto } from 'src/common/dto/contrainte-livraison/contrainte-livraison-dto';
import { Repository } from 'typeorm';
import { PointLivraisonService } from '../point-livraison/point-livraison.service';
import { PointLivraisonEntity } from '../point-livraison/point-livraison.entity';
import { ContrainteLivraisonEntity } from './contrainte-livraison.entity';
import { ContrainteJourEntity } from '../contrainte-jour/contrainte-jour.entity';
import { ContrainteJourDto } from 'src/common/dto/contrainte-jour/contrainte-jour-dto';

@Injectable()
export class ContrainteLivraisonService {

    constructor(
        @InjectRepository(ContrainteLivraisonEntity)
        private readonly contrainteLivaisonRep: Repository<ContrainteLivraisonEntity>,
        @Inject(forwardRef(() => PointLivraisonService))
        private readonly pointLivraisonService: PointLivraisonService,
        @InjectRepository(ContrainteJourEntity)
        private readonly contrainteJourRep: Repository<ContrainteJourEntity>,
    ){}

    async findById(id:number):Promise<ContrainteLivraisonEntity> {
        const matched = await this.contrainteLivaisonRep.findOne({
            where: {id: id},
            relations: ["contrainte_jour_livraisons"]
        });

        if(!matched) throw new BadRequestException(`Contrainte Livraison avec id:${id} est introuvable!`);

        return matched;
    }

    async findAll():Promise<ContrainteLivraisonEntity[]> {
        return this.contrainteLivaisonRep.find({
            relations: ["contrainte_jour_livraisons"]
        });
    }

    async save(dto: ContrainteLivraisonDto): Promise<ContrainteLivraisonEntity>{
        if(!dto) throw new BadRequestException("Données Invalides");
        
        const pl = await this.getPointLivraison(dto.id_point_livraison);
        const contrainte: ContrainteLivraisonEntity = plainToInstance(ContrainteLivraisonEntity, dto);
        contrainte.point_livraison =  pl;
        
        const prepare = this.contrainteLivaisonRep.create(contrainte);
        return this.contrainteLivaisonRep.save(prepare);
    }

    async attachDayConstraintsToDeliveryConstraint(idConstraint: number, dayConstraints: ContrainteJourDto[]) {
        if(!idConstraint || !dayConstraints) throw new BadRequestException("Données Invalides");

        const existingConstraint: ContrainteLivraisonEntity = await this.findById(idConstraint);
        if(!existingConstraint) throw new NotFoundException("Contrainte Livraison Introuvable!");

        const dayConstraintsEntities:ContrainteJourEntity[] = plainToInstance(ContrainteJourEntity, dayConstraints);

        if(!Array.isArray(dayConstraints)) throw new BadRequestException("Le contrainte jour doit être un tableau!");
        dayConstraintsEntities.forEach(d => {
            d.contrainte_livraison = existingConstraint;
        });

        const queryRunner = this.contrainteJourRep.manager.connection.createQueryRunner();

        //start a transaction
        await queryRunner.startTransaction();
        try {

            await queryRunner.manager.save(ContrainteJourEntity, dayConstraintsEntities);
            await queryRunner.commitTransaction();

            return {message: `Contrainte(s) jour(s)  rattachée(s) à ${existingConstraint.intitule_contrainte}  avec succes!`};
        } catch (error) {
            await queryRunner.rollbackTransaction();
            throw error;
        } finally {
            await queryRunner.release();
        }        

    }

    async updateDayConstraints(idConstraint: number, idContrainteJour: number,dto: ContrainteJourDto) {
        if(!idConstraint || !dto || !idContrainteJour) throw new BadRequestException("Données Invalides");

        const existing: ContrainteJourEntity|null = await this.contrainteJourRep.findOne({where: {id: idContrainteJour}}); 
        if(!existing) throw new NotFoundException(`Contrainte Jour avec id:${idContrainteJour} est introuvable`);

        const existingConstraint: ContrainteLivraisonEntity = await this.findById(idConstraint);
        const instance: ContrainteJourEntity = plainToInstance(ContrainteJourEntity, dto);
        instance.contrainte_livraison = existingConstraint;

        const preapred =this.contrainteJourRep.create(instance);
        return this.contrainteJourRep.save(preapred);
    }

    async update(id: number, dto: ContrainteLivraisonDto): Promise<ContrainteLivraisonEntity> {
        if (!dto || !id) throw new BadRequestException("Données Invalides");

        const existing = await this.findById(id);
        const pl = await this.getPointLivraison(dto.id_point_livraison);
        dto.id = dto.id ?? id;

        const contrainte: ContrainteLivraisonEntity = plainToInstance(ContrainteLivraisonEntity, dto);
        contrainte.point_livraison = pl;

        // Update the existing entity with new values
        Object.assign(existing, contrainte);
        
        return this.contrainteLivaisonRep.save(existing);
    }


    private async getPointLivraison(id: number): Promise<PointLivraisonEntity> {
        return await this.pointLivraisonService.findById(id);
    }
}