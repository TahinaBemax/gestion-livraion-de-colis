import { AnimationVilleService } from './animation-ville/animation-ville.service';
import { In, Repository } from 'typeorm';
import { PointLivraison } from './point-livraison.entity';
import { Inject, Injectable, NotFoundException, forwardRef } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { PointLivraisonCreateDto } from 'src/common/dto/point-livraison/point-livraison-create-dto';
import { plainToInstance } from 'class-transformer';
import { PrestataireService } from '../prestataire/prestataire.service';
import { ContrainteLivraisonService } from './contrainte-livraison/contrainte-livraison.service';
import { Prestataire } from '../prestataire/prestataire.entity';
import { ContrainteAnimationVille } from '../contrainte-animation-ville/contrainte-animation-ville.entity';

@Injectable()
export class PointLivraisonService {
    constructor(
        @InjectRepository(PointLivraison)
        private readonly pointLivraisonRep: Repository<PointLivraison>,
        private readonly prestataireService: PrestataireService,
        @Inject(forwardRef(() => ContrainteLivraisonService))
        private readonly containteLivraisonService: ContrainteLivraisonService,
        private readonly animationVilleService: AnimationVilleService
    ){}

    async create(dto: PointLivraisonCreateDto): Promise<PointLivraison>{
        const pointLivraison: PointLivraison = plainToInstance(PointLivraison, dto);
        this.prepareChildrensData(dto,  pointLivraison);

        const prepared = this.pointLivraisonRep.create(pointLivraison);
        return this.pointLivraisonRep.save(prepared);
    }

    async findAll(): Promise<PointLivraison[]> {
        return this.pointLivraisonRep.find({relations: ["contraintes_livraison", "animations_ville"]});
    }

    async findById(id:number): Promise<PointLivraison> {
        return this.pointLivraisonRep.findOneOrFail(
            {
                where: {id_point_livraison: id},
                relations: ["contraintes_livraison", "animations_ville"]
            }
        );
    }

    async findByPrestataire(id:number): Promise<PointLivraison[]> {
        return this.pointLivraisonRep.createQueryBuilder("pl")
            .innerJoinAndSelect("pl.prestataire", "p")
            .where("p.id_prestataire = :id", {id: `${id}`})
            .getMany();
    }

    async update(id: number, dto: PointLivraisonCreateDto): Promise<PointLivraison>{
        const matched = this.findById(id);

        if(!matched) throw new NotFoundException(`Point de Livraison:{${id}} Introuvable!`);

        const pointLivraison: PointLivraison = plainToInstance(PointLivraison, dto);
        pointLivraison.id_point_livraison = id;
        this.prepareChildrensData(dto,  pointLivraison);

        const prepared = this.pointLivraisonRep.create(pointLivraison);
        return this.pointLivraisonRep.save(prepared);
    }


    private async prepareChildrensData(dto: PointLivraisonCreateDto, pointLivraison: PointLivraison) {
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
            pointLivraison.animations_ville = pointLivraison.animations_ville || []; // Initialize if undefined
            for (const animationId of dto.animations_ville) {
                const animation = await this.animationVilleService.findById(animationId);
                const contrainte_animation = new ContrainteAnimationVille();
                contrainte_animation.animation_ville = animation;
                pointLivraison.animations_ville.push(contrainte_animation);
            }
        }
    }

    async assignDeliveryPointsToProvider(prestataire: Prestataire, id_points_livraison:number[]): Promise<{message: string}>{
        const queryRunner = this.pointLivraisonRep.manager.connection.createQueryRunner();

        //start a transaction
        await queryRunner.startTransaction();
        try {
            const pls = await this.pointLivraisonRep.findBy({ id_point_livraison: In(id_points_livraison) });
            pls.forEach(pl => {
                pl.prestataire = prestataire;
            });

            await queryRunner.manager.save(PointLivraison, pls);

            await queryRunner.commitTransaction();

            return {message: "Points de livraison rattachés avec succes!"};
        } catch (error) {
            await queryRunner.rollbackTransaction();
            throw error;
        } finally {
            await queryRunner.release();
        }
    }
}
