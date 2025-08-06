import { AnimationVilleService } from './animation-ville/animation-ville.service';
import { In, Repository } from 'typeorm';
import { PointLivraison } from './point-livraison.entity';
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { PointLivraisonCreateDto } from 'src/common/dto/point-livraison/point-livraison-create-dto';
import { plainToInstance } from 'class-transformer';
import { PrestataireService } from '../prestataire/prestataire.service';
import { ContrainteLivraisonService } from './contrainte-livraison/contrainte-livraison.service';
import { Prestataire } from '../prestataire/prestataire.entity';

@Injectable()
export class PointLivraisonService {
    constructor(
        @InjectRepository(PointLivraison)
        private readonly pointLivraisonRep: Repository<PointLivraison>,
        private readonly prestataireService: PrestataireService,
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


    private async prepareChildrensData(dto: PointLivraisonCreateDto, pointLivraison: PointLivraison){
        const prestataire = dto.prestataire !== undefined ? await this.prestataireService.findById(dto.prestataire) : undefined;
        pointLivraison.prestataire = prestataire;
        
        dto.contraintes_livraison?.forEach(async (c) => {
            const contrainte = await this.containteLivraisonService.findById(c);
            pointLivraison.contraintes_livraison?.push(contrainte);
        });

        dto.animations_ville?.forEach(async (c) => {
            const contrainte = await this.animationVilleService.findById(c);
            pointLivraison.animations_ville?.push(contrainte);
        });
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
