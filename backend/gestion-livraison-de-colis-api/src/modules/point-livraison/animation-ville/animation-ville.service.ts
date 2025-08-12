import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AnimationVille } from './animation-ville.entity';
import { AnimationVilleDto } from 'src/common/dto/animation-ville/animation-ville-dto';
import { plainToInstance } from 'class-transformer';
import { PointLivraison } from '../point-livraison.entity';
import { ContrainteAnimationVille } from 'src/modules/contrainte-animation-ville/contrainte-animation-ville.entity';
import { UpdateAnimationVilleDto } from 'src/common/dto/animation-ville/update-animation-ville-dto';
import { isValid, parse } from 'date-fns';

@Injectable()
export class AnimationVilleService {
    constructor(
        @InjectRepository(AnimationVille)
        private readonly animationVilleRep: Repository<AnimationVille>,
        @InjectRepository(PointLivraison)
        private readonly PointLivraisonRep: Repository<PointLivraison>,
        @InjectRepository(ContrainteAnimationVille)
        private readonly ContrainteAnimationVilleRep: Repository<ContrainteAnimationVille>
    ){}

    async findById(id:number):Promise<AnimationVille> {
        return this.animationVilleRep.findOneOrFail({
            where: {id_animation_ville: id}
        });
    }

    async findAll(): Promise<AnimationVille[]> {
        return this.animationVilleRep.find();
    }

    async save(dto: AnimationVilleDto): Promise<AnimationVille> {
        if(!dto) throw new NotFoundException("Données invalides");

        const animation = this.handleDateFormat(dto);
        animation.contrainte_animation_ville = await this.getContrainteAnimationVille(dto.point_livraison);
        const prepared = this.animationVilleRep.create(animation);
        return this.animationVilleRep.save(prepared);
    }

    async update(id: number, dto: UpdateAnimationVilleDto): Promise<AnimationVille> {
        if (!dto || !id) throw new NotFoundException("Données invalides");

        // Fetch existing animation once
        const existingAnimation = await this.animationVilleRep.findOne({
            where: { id_animation_ville: id },
            relations: ['contrainte_animation_ville']
        });

        if (!existingAnimation) throw new NotFoundException(`Animation Ville avec id:${id} est introuvable`);

        // Handle the date format
        const animation = this.handleDateFormat(dto);
        animation.id_animation_ville = id;  // Ensure we are updating the correct record

        // Handle contrainte animations villes if provided
        if (dto.contraintes_animations_villes) {
            const contraintePromises = dto.contraintes_animations_villes.map(async (c) => {
                let existing: ContrainteAnimationVille|null;

                // If ID is provided, update existing contrainte
                if (c.id_contrainte_animation_ville) {
                    existing = await this.ContrainteAnimationVilleRep.findOne({
                        where: { id_contrainte_animation_ville: c.id_contrainte_animation_ville },
                        relations: ["animation_ville", "point_livraison"]
                    });

                    if (!existing) throw new NotFoundException("Contrainte Animation Ville Introuvable");

                    // Update the fields of the existing contrainte
                    existing.point_livraison.id_point_livraison = c.id_point_livraison;
                    existing.animation_ville.id_animation_ville = c.id_animation_ville;
                } else {
                    // If no ID, create a new one
                    existing = new ContrainteAnimationVille();
                    existing.point_livraison = await this.PointLivraisonRep.findOneOrFail({
                        where: { id_point_livraison: c.id_point_livraison }
                    });
                    existing.animation_ville = existingAnimation;
                }

                return existing;
            });

            // Await all promises in parallel
            animation.contrainte_animation_ville = await Promise.all(contraintePromises);
        }

        // Save the updated animation
        return this.animationVilleRep.save(animation);
    }


    private async getContrainteAnimationVille(pointsLivraisons?: number[]){
        if(pointsLivraisons){
            return Promise.all(
                pointsLivraisons.map( async pl => {
                    const existing = await this.PointLivraisonRep.findOneOrFail({where: {id_point_livraison: pl}});

                    const contrainte_animation = new ContrainteAnimationVille();
                    contrainte_animation.point_livraison = existing;
                    return contrainte_animation;
                })
            );
        }
    }

    private handleDateFormat(dto: AnimationVilleDto|UpdateAnimationVilleDto) {
        const date_debut = parse(dto.date_debut, 'dd/MM/yyyy', new Date());
        const date_fin = parse(dto.date_fin, 'dd/MM/yyyy', new Date());

        if (!isValid(date_debut)) {
          throw new BadRequestException("Date début invalide");
        }

        if (!isValid(date_fin)) {
          throw new BadRequestException("Date fin invalide");
        }

        const animation: AnimationVille = plainToInstance(AnimationVille, dto);
        animation.date_debut = date_debut;
        animation.date_fin = date_fin;

        return animation;
    }
}
