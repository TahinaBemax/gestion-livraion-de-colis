import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { PlanningLivraisonEntity } from './planning-livraison.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { plainToInstance } from 'class-transformer';
import { PlanningLivraisonCreateDto } from 'src/common/dto/planning-livraison/create-planning-dto';
import { StatutPlanningLivaison } from 'src/common/enum/status-planning-livraison';
import { Utils } from 'src/common/utils/utils';

@Injectable()
export class PlanningLivraisonService {
    constructor(
        @InjectRepository(PlanningLivraisonEntity)
        private readonly planningRep: Repository<PlanningLivraisonEntity>,
    ){}

    async findAll(): Promise<PlanningLivraisonEntity[]> {
        return this.planningRep.find({relations: ["tournees_livraison"] });
    }
    
    async findById(id: number): Promise<PlanningLivraisonEntity> {
        const mathced = await this.planningRep.findOne({
            where: {id: id},
            relations: ["tournees_livraison"] 
        });

        if(!mathced) throw new NotFoundException(`Planning Livraison avec ID:{${id}} est introuvable!`);

        return mathced;
    }

    async saveDraftPlanning(dto: PlanningLivraisonCreateDto){
        if(!dto) throw new BadRequestException("Données planning livraison invalides");
        Utils.isValidDateInterval(dto.date_debut, dto.date_fin);
        
        const planning = plainToInstance(PlanningLivraisonEntity, dto);
        planning.statut = StatutPlanningLivaison.BROUILLON;

        const prepared = this.planningRep.create(planning);
        return this.planningRep.save(prepared);
    }

    async changeStatuts(id: number, statut:string ){
        if(!id) throw new BadRequestException("Donnée planning livraison invalide");
        Utils.isValidStatus(statut, StatutPlanningLivaison);
        
        const planning = await this.findById(id);
        planning.statut = statut;
        await this.planningRep.save(planning);
        
        return "Statuts modifié avec succés!";
    }
    
    async updatePlanning(id: number, dto: PlanningLivraisonCreateDto){
        if(!dto || !id) throw new BadRequestException("Données planning livraison invalides");
        Utils.isValidDateInterval(dto.date_debut, dto.date_fin);
        const existing = await this.findById(id);

        if(existing.statut !== StatutPlanningLivaison.BROUILLON && existing.statut !== StatutPlanningLivaison.PLANIFIE){
            throw new BadRequestException(`Planning de livraison avec statuts: ${existing.statut} ne peut plus être modifier!`);
        }

        existing.priorite_livraison = dto.priorite_livraison;

        return this.planningRep.save(existing);
    }

    async deletePlanning(id: number) {
        if(!id) throw new BadRequestException("Id planning livraison invalide");
        const existing = await this.findById(id);

        if(existing.statut !== StatutPlanningLivaison.BROUILLON && existing.statut !== StatutPlanningLivaison.PLANIFIE){
            throw new BadRequestException(`Planning de livraison avec statuts: ${existing.statut} ne peut plus être supprimer!`);
        }

        return this.planningRep.delete(existing);
    }



}
