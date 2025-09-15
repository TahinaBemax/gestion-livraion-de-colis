import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { TourneeLivraisonEntity } from './tournee-livraison.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { plainToInstance } from 'class-transformer';
import { Utils } from 'src/common/utils/utils';
import { Repository } from 'typeorm';
import { TourneeLivraisonCreateDto } from 'src/common/dto/tournee-livraison/create-tournee-livraison-dto';
import { Livreur } from '../livreur/livreur.entity';
import { StatutTourneeLivaison } from 'src/common/enum/status-tournee-livraison';
import { PlanningLivraisonEntity } from '../planning-livraison/planning-livraison.entity';
import { isValid, isWithinInterval, parseISO } from 'date-fns';
import { StatutPlanningLivaison } from 'src/common/enum/status-planning-livraison';
import { Prestataire } from '../prestataire/prestataire.entity';

@Injectable()
export class TourneeLivraisonService {
    constructor(
        @InjectRepository(TourneeLivraisonEntity)
        private readonly tourneeRep: Repository<TourneeLivraisonEntity>,
        @InjectRepository(Livreur)
        private readonly livreurRep: Repository<Livreur>,
        @InjectRepository(PlanningLivraisonEntity)
        private readonly planningRep: Repository<PlanningLivraisonEntity>,
        @InjectRepository(Prestataire)
        private readonly prestataireRep: Repository<Prestataire>,
    ){}

    async findAll(): Promise<TourneeLivraisonEntity[]> {
        return this.tourneeRep.find({relations: ["ordres_livraison"] });
    }

    async findAllByPlanning(idPlanning: number): Promise<TourneeLivraisonEntity[]> {
        return this.tourneeRep.createQueryBuilder("t")
        .innerJoinAndSelect("t.planning_livraison", "pl")
        .where("pl.id = :id", {id: idPlanning})
        .getMany();
    }
    
    async findById(id: number): Promise<TourneeLivraisonEntity> {
        const mathced = await this.tourneeRep.findOne({
            where: {id: id},
            relations: ["ordres_livraison"] 
        });

        if(!mathced) throw new NotFoundException(`Tournée Livraison avec ID:{${id}} est introuvable!`);

        return mathced;
    }

    async save(idPlanning: number, dto: TourneeLivraisonCreateDto){
        if(!dto) throw new BadRequestException("Données tournée livraison invalides");

        const tournee = await this.getTourneeLivraisonInstance(idPlanning, dto);
        const prepared = this.tourneeRep.create(tournee);
        return this.tourneeRep.save(prepared);
    }

    async batchSave(idPlanning: number, dtos: TourneeLivraisonCreateDto[]){
        if(!dtos) throw new BadRequestException("Données tournée livraison invalides");

        const tournees:TourneeLivraisonEntity[] = await Promise.all(dtos.map(async (dto) => {
            return await this.getTourneeLivraisonInstance(idPlanning, dto);
        }));

        const prepared = this.tourneeRep.create(tournees);
        return this.tourneeRep.save(prepared);
    }

    async changeStatuts(id: number, statut:string ){
        if(!id) throw new BadRequestException("Donnée tournée de livraison invalide");
        const statuts = Object.values(StatutTourneeLivaison);

        if(statuts.filter(s => s === statut).length === 0) throw new BadRequestException(`Statut inconnue! Le statut doit être: ${statuts}`);

        const tournée = await this.findById(id);
        tournée.statut = statut;
        await this.tourneeRep.save(tournée);

        return "Statuts modifié avec succés!";
    }

    async update(id: number, dto: TourneeLivraisonCreateDto){
        if(!dto || !id) throw new BadRequestException("Données planning livraison invalides");
        const existing = await this.findById(id);

        if(existing.statut !== StatutTourneeLivaison.BROUILLON && existing.statut !== StatutTourneeLivaison.PLANIFIE){
            throw new BadRequestException(`Planning de livraison avec statuts: ${existing.statut} ne peut plus être modifier!`);
        }

        if(dto.id_livreur){
            const livreur: Livreur = await this.getLivreur(dto.id_livreur);
            existing.livreur = livreur;
        }
        const planning_livraison: PlanningLivraisonEntity = existing.planning_livraison;
        this.isDateTourneeBetween(dto.date_tournee, planning_livraison.date_debut, planning_livraison.date_fin);

        existing.date_tournee = dto.date_tournee;
        existing.planning_livraison = planning_livraison;

        return this.tourneeRep.save(existing);
    }

    async deleteDraft(id: number) {
        if(!id) throw new BadRequestException("Id tournée de livraison invalide");
        const existing = await this.findById(id);

        if(existing.statut !== StatutTourneeLivaison.BROUILLON && existing.statut !== StatutTourneeLivaison.ANNULE){
            throw new BadRequestException(`Tournée de livraison avec statuts: ${existing.statut} ne peut plus être supprimer!`);
        }

        return this.tourneeRep.delete(existing.id);
    }  

    private async getLivreur(id: number): Promise<Livreur>{
        const livreur: Livreur|null = await this.livreurRep.findOne({where: {id_livreur: id}});
        if(!livreur) throw new NotFoundException(`Livreur avec ID:{${id} est introuvable!}`);

        return livreur;
    }

    private async getPlanning(id: number): Promise<PlanningLivraisonEntity>{
        const planning_livraison: PlanningLivraisonEntity|null = await this.planningRep.findOne({where: {id: id}});
        if(!planning_livraison) throw new NotFoundException(`Planning livraison avec ID:${id} introuvable!`);

        return planning_livraison;
    }

    private isDateTourneeBetween(date_tournee: string, date_debut: string, date_fin:string){
        const parsedDate = Utils.parseToFRDate(date_tournee);

        if(!isValid(parsedDate)) throw new Error("Date invalide");

        const target_date = new Date(parsedDate.setHours(0, 0, 0, 0));
        target_date.setDate(target_date.getDate() + 1);
        
        const start_date = parseISO(date_debut);
        const end_date = parseISO(date_fin);

        if(!isWithinInterval(target_date, {start: start_date, end: end_date})){
            throw new BadRequestException(`La date du tournée doit être entre ${date_debut} et ${date_fin}`);
        }

        return true;
    }

    private async getTourneeLivraisonInstance(idPlanning: number, dto: TourneeLivraisonCreateDto){
        if(!dto) throw new BadRequestException("Données tournée livraison invalides");

        const tournee = plainToInstance(TourneeLivraisonEntity, dto);
        const planning_livraison: PlanningLivraisonEntity= await this.getPlanning(idPlanning);
        
        if(planning_livraison.statut_planning === StatutPlanningLivaison.ANNULE 
            || planning_livraison.statut_planning === StatutPlanningLivaison.TERMINE
        ) throw new BadRequestException(`Impossible de créer un tournée de livraison pour un planning de livraison avec statut: ${planning_livraison.statut_planning}`);

        if(dto.id_livreur){
            const livreur: Livreur = await this.getLivreur(dto.id_livreur);
            tournee.livreur = livreur;
        }
        
        this.isDateTourneeBetween(dto.date_tournee, planning_livraison.date_debut, planning_livraison.date_fin);

        const matchedPrestataire = await this.prestataireRep.findOneBy({id_prestataire: dto.id_prestatiare});
        if(!matchedPrestataire) throw new BadRequestException("Prestataire inexistant!");

        tournee.date_tournee = dto.date_tournee;
        tournee.prestataire = matchedPrestataire;
        tournee.planning_livraison = planning_livraison;
        tournee.statut = StatutTourneeLivaison.BROUILLON;

        return tournee;        
    }
}
