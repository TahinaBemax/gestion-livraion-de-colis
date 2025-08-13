
import { In, Repository } from 'typeorm';
import { BadRequestException, Inject, Injectable, NotFoundException, forwardRef } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CreatePointLivraisonDto } from 'src/common/dto/point-livraison/point-livraison-create-dto';
import { plainToInstance } from 'class-transformer';
import { PrestataireService } from '../prestataire/prestataire.service';
import { Prestataire } from '../prestataire/prestataire.entity';
import { PointLivraisonEntity } from './point-livraison.entity';
import { EvenementLocalService } from '../evenement-local/evenement-local.service';
import { ContrainteLivraisonService } from '../contrainte-livraison/contrainte-livraison.service';
import { ContrainteLivraisonEntity } from '../contrainte-livraison/contrainte-livraison.entity';


@Injectable()
export class PointLivraisonService {
    constructor(
        @InjectRepository(PointLivraisonEntity)
        private readonly pointLivraisonRep: Repository<PointLivraisonEntity>,
        private readonly prestataireService: PrestataireService,
        @InjectRepository(ContrainteLivraisonEntity)
        private readonly contrainteLivraisonRep: Repository<ContrainteLivraisonEntity>,
        private readonly evenementService: EvenementLocalService
    ){}


    async create(dto: CreatePointLivraisonDto): Promise<PointLivraisonEntity>{
        const pointLivraison: PointLivraisonEntity = plainToInstance(PointLivraisonEntity, dto);

        const prepared = this.pointLivraisonRep.create(pointLivraison);
        return this.pointLivraisonRep.save(prepared);
    }

    async findAll(): Promise<PointLivraisonEntity[]> {
        return this.pointLivraisonRep.find({relations: ["contraintes_livraison", "contraintes_evenements"]});
    }

    async findById(id:number): Promise<PointLivraisonEntity> {
        const matched = await this.pointLivraisonRep.findOne(
            {
                where: {id: id},
                relations: ["contraintes_livraison", "contraintes_evenements"]
            }
        );

        if(!matched){
            throw new BadRequestException(`Point de Livraison avec id: ${id} introuvable!`) 
        } 

        return matched; 
    }

    async findByPrestataire(id:number): Promise<PointLivraisonEntity[]> {
        return this.pointLivraisonRep.createQueryBuilder("pl")
            .innerJoinAndSelect("pl.prestataire", "p")
            .where("p.id_prestataire = :id", {id: `${id}`})
            .getMany();
    }

    async update(id: number, dto: CreatePointLivraisonDto): Promise<PointLivraisonEntity>{
        if(!dto || !id) throw new BadRequestException("Données Invalides!");
        const matched = this.findById(id);

        if(!matched) throw new NotFoundException(`Point de Livraison avec id:{${id}} est introuvable!`);

        const pointLivraison: PointLivraisonEntity = plainToInstance(PointLivraisonEntity, dto);
        pointLivraison.id = pointLivraison.id ?? id;

        const prepared = this.pointLivraisonRep.create(pointLivraison);
        return this.pointLivraisonRep.save(prepared);
    }

    async findByCityNumeroMagasin(city: string, numMagasin: string): Promise<PointLivraisonEntity[]> {
        if(!city && !numMagasin) throw new BadRequestException("La ville et le numero de magasin sont obligatoire!");

        return this.pointLivraisonRep.find({
            where: {ville: city, numero_magasin: numMagasin},
            relations: ["contraintes_livraison", "contraintes_evenements"]
        });
    }


    /*private async prepareChildrensData(dto: PointLivraisonCreateDto, pointLivraison: PointLivraisonEntity) {
        // 1. Assign prestataire if it exists
        if (dto.prestataire !== undefined) {
            const prestataire = await this.prestataireService.findById(dto.prestataire);
            pointLivraison.prestataire = prestataire;
        }

        // 2. Ensure contraintes_livraison array exists and fill it
        if (dto.contraintes_livraison) {
            pointLivraison.contraintes_livraison = pointLivraison.contraintes_livraison || []; // Initialize if undefined
            for (const contrainteId of dto.contraintes_livraison) {
                const contrainte = await this.containteLivraisonService.findById(contrainteId);
                pointLivraison.contraintes_livraison.push(contrainte);
            }
        }

        // 3. Ensure animations_ville array exists and fill it with ContrainteAnimationVille
        if (dto.animations_ville) {
            pointLivraison = pointLivraison || []; // Initialize if undefined
            for (const animationId of dto) {
                const animation = await this.evenementService.findById(animationId);
                const contrainte_animation = new ContrainteAnimationVille();
                contrainte_animation.animation_ville = animation;
                pointLivraison.push(contrainte_animation);
            }
        }
    } */

    async assignDeliveryPointsToProvider(prestataire: Prestataire, id_points_livraison:number[]): Promise<{message: string}>{
        if(!id_points_livraison || id_points_livraison.length === 0) throw new BadRequestException("Il faut mettre au moins un point de livraison!");
        const queryRunner = this.pointLivraisonRep.manager.connection.createQueryRunner();

        //start a transaction
        await queryRunner.startTransaction();
        try {
            const pls = await this.pointLivraisonRep.findBy({ id: In(id_points_livraison) });
            if(pls.length === 0) throw new BadRequestException(`Aucun point de livraison pour les identifiants: [${id_points_livraison.toString()}] trouvé!`)

            pls.forEach(pl => {
                if(pl.prestataire) throw new BadRequestException(`Le point de livraison ${pl.numero_magasin} est déja rattaché à un prestataire`);
                pl.prestataire = prestataire;
            });

            await queryRunner.manager.save(PointLivraisonEntity, pls);

            await queryRunner.commitTransaction();

            return {message: "Points de livraison rattachés avec succes!"};
        } catch (error) {
            await queryRunner.rollbackTransaction();
            throw error;
        } finally {
            await queryRunner.release();
        }
    }

    async assignDeliveryConstraintsToPL(idPL: number, idConstraintes: number[]): Promise<{message: string}> {
        if(!idPL || idConstraintes.length === 0) throw new BadRequestException("Il faut mettre au moins une contrainte de livraison!");
        const existingPL = await this.findById(idPL);
        const queryRunner = this.contrainteLivraisonRep.manager.connection.createQueryRunner();

        //start a transaction
        await queryRunner.startTransaction();
        try {
            const constraints = await this.contrainteLivraisonRep.findBy({ id: In(idConstraintes) });
            if(constraints.length === 0) throw new BadRequestException(`Aucune contrainte de livraison pour les identifiants: [${idConstraintes.toString()}] trouvée!`)
             
            for (const c of constraints) {
                if(c.point_livraison) throw new BadRequestException(`${c.intitule_contrainte} est déja rattachéé à un point de livraison!`);
                c.point_livraison = existingPL;
            }

            await queryRunner.manager.save(PointLivraisonEntity, constraints);
            await queryRunner.commitTransaction();

            return {message: `Contrainte(s) temporelle de livraison rattachée(s) à ${existingPL.numero_magasin}  avec succes!`};
        } catch (error) {
            await queryRunner.rollbackTransaction();
            throw error;
        } finally {
            await queryRunner.release();
        }
    }
}
