import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { plainToInstance } from 'class-transformer';
import { isValid, parse } from 'date-fns';
import { Repository } from 'typeorm';
import { PointLivraisonEntity } from '../point-livraison/point-livraison.entity';
import { ContrainteEvenementEntity } from '../contrainte-evenement/contrainte-evenement.entity';
import { EvenementLocalEntity } from './evenement-local.entity';
import { EvenementLocalDto } from 'src/common/dto/evenement-local/evenement-local-dto';


@Injectable()
export class EvenementLocalService {
    constructor(
        @InjectRepository(EvenementLocalEntity)
        private readonly evenementLocalRep: Repository<EvenementLocalEntity>,
        @InjectRepository(PointLivraisonEntity)
        private readonly PointLivraisonRep: Repository<PointLivraisonEntity>,
        @InjectRepository(ContrainteEvenementEntity)
        private readonly ContrainteEvenementRep: Repository<ContrainteEvenementEntity>
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

    async save(dto: EvenementLocalDto): Promise<EvenementLocalEntity> {
        if(!dto) throw new NotFoundException("Données invalides");

        const animation = this.handleDateFormat(dto);
        const prepared = this.evenementLocalRep.create(animation);
        return this.evenementLocalRep.save(prepared);
    }

    async update(id: number, dto: EvenementLocalDto): Promise<EvenementLocalEntity> {
        if (!dto || !id) throw new NotFoundException("Données invalides");

        // Fetch existing animation once
        const existingAnimation = await this.findById(id);

        // Handle the date format
        const animation = this.handleDateFormat(dto);
        animation.id = dto.id ?? id;  // Ensure we are updating the correct record

        // Save the updated animation
        const preapred = this.evenementLocalRep.create(animation);
        return this.evenementLocalRep.save(preapred);
    }

    // async update2(id: number, dto: UpdateEvenementLocalDto): Promise<EvenementLocalEntity> {
    //     if (!dto || !id) throw new NotFoundException("Données invalides");

    //     // Fetch existing animation once
    //     const existingAnimation = await this.evenementLocalRep.findOne({
    //         where: { id: id },
    //         relations: ['contrainte_animation_ville']
    //     });

    //     if (!existingAnimation) throw new NotFoundException(`Animation Ville avec id:${id} est introuvable`);

    //     // Handle the date format
    //     const animation = this.handleDateFormat(dto);
    //     animation.id = id;  // Ensure we are updating the correct record

    //     // Handle contrainte animations villes if provided
    //     if (dto.contraintes_animations_villes) {
    //         const contraintePromises = dto.contraintes_animations_villes.map(async (c) => {
    //             let existing: ContrainteEvenementEntity|null;

    //             // If ID is provided, update existing contrainte
    //             if (c.id_contrainte_animation_ville) {
    //                 existing = await this.ContrainteEvenementRep.findOne({
    //                     where: { id: c.id_contrainte_animation_ville },
    //                     relations: ["animation_ville", "point_livraison"]
    //                 });

    //                 if (!existing) throw new NotFoundException("Contrainte Animation Ville Introuvable");

    //                 // Update the fields of the existing contrainte
    //                 existing.point_livraison.id = c.id_point_livraison;
    //                 existing.evenement_local.id = c.id_animation_ville;
    //             } else {
    //                 // If no ID, create a new one
    //                 existing = new ContrainteEvenementEntity();
    //                 existing.point_livraison = await this.PointLivraisonRep.findOneOrFail({
    //                     where: { id: c.id_point_livraison }
    //                 });
    //                 existing.evenement_local = existingAnimation;
    //             }

    //             return existing;
    //         });

    //     }

    //     // Save the updated animation
    //     return this.evenementLocalRep.save(animation);
    // }


    private async getContrainteEvenement(pointsLivraisons?: number[]){
        if(pointsLivraisons){
            return Promise.all(
                pointsLivraisons.map( async pl => {
                    const existing = await this.PointLivraisonRep.findOneOrFail({where: {id: pl}});

                    const contrainte_animation = new ContrainteEvenementEntity();
                    contrainte_animation.point_livraison = existing;
                    return contrainte_animation;
                })
            );
        }
    }

    private handleDateFormat(dto: EvenementLocalDto) {
        const date_debut = parse(dto.date_debut, 'dd/MM/yyyy', new Date());
        const date_fin = parse(dto.date_fin, 'dd/MM/yyyy', new Date());

        if (!isValid(date_debut)) {
          throw new BadRequestException("Date début invalide");
        }

        if (!isValid(date_fin)) {
          throw new BadRequestException("Date fin invalide");
        }

        const animation: EvenementLocalEntity = plainToInstance(EvenementLocalEntity, dto);
        animation.date_debut = date_debut;
        animation.date_fin = date_fin;

        return animation;
    }
}
