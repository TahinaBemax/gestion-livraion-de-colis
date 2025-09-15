import { TourneeLivraisonCreateDto } from 'src/common/dto/tournee-livraison/create-tournee-livraison-dto';
import { PlanningLivraisonCreateDto } from 'src/common/dto/planning-livraison/create-planning-dto';
import { Body, Controller, Delete, Get, Param, ParseIntPipe, Post, Put, Query } from '@nestjs/common';
import { PlanningLivraisonService } from './planning-livraison.service';
import { ApiBody, ApiOperation, ApiQuery, ApiTags } from '@nestjs/swagger';
import { TourneeLivraisonService } from '../tournee-livraison/tournee-livraison.service';

@Controller('plannings')
@ApiTags("Plannings Livraison")
export class PlanningLivraisonController {
    constructor(
        private readonly planningService: PlanningLivraisonService,
        private readonly tourneeService: TourneeLivraisonService
    ){}

    /**
     * LISTE TOUS LES PLANNINGS DE LIVRAISON
     * @returns Liste de tous les plannings de livraison
     */
    @Get()
    getAll(){
        return this.planningService.findAll();
    }

    /**
     * DETAIL D'UN PLANNING DE LIVRAISON
     * @param id Identifiant du planning de livraison
     * @returns Détails d'un planning de livraison
     */
    @Get("/:id")
    getByid(@Param("id", ParseIntPipe) id: number){
        return this.planningService.findById(id);
    }

    /**
     * ENREGISTREMENT D'UN PLANNING DE LIVRAISON
     * @param dto Donnée d'un planning de livraison
     * @returns Planning de livraison enregistré
     */
    @Post()
    @ApiBody({type: PlanningLivraisonCreateDto})
    saveDraft(@Body() dto: PlanningLivraisonCreateDto){
        return this.planningService.saveDraftPlanning(dto);
    }
    
    /**
     * MODIFICATION D'UN PLANNING DE LIVRAISON
     * @param id Identifiant du planning de livraison
     * @param dto Donnée du planning de livraison
     * @returns Planning de livraison modifié
     */
    @Put("/:id")
    @ApiBody({type: PlanningLivraisonCreateDto})
    update(@Param("id", ParseIntPipe) id: number, @Body() dto: PlanningLivraisonCreateDto){
        return this.planningService.updatePlanning(id, dto);
    }
 
    /**
     * MODIFICATION DU STATUT D'UN PLANNING DE LIVRAISON
     * @param id Identifiant du planning de livraison
     * @param statut Nouveau statut du planning de livraison
     * @returns Planning de livraison modifié
     */
    @Put("/:id/change-statut")
    @ApiQuery({type: "Annulé, Planifié, En cours, Terminé, Partiellement exécuté", description: "Change le statut d'un planning livraison!"})
    changeStatuts(@Param("id", ParseIntPipe) id: number, @Query("statut") statut: string){
        return this.planningService.changeStatuts(id, statut);
    }

    /**
     * SUPPRESSION D'UN PLANNING DE LIVRAISON
     * @param id Identifiant du planning de livraison
     * @returns Planning de livraison supprimé
     */
    @Delete("/:id")
    delete(@Param("id", ParseIntPipe) id: number) {
        return this.planningService.deletePlanning(id);
    }


    /* TOURNEE DE LIVRAISON */

        /**
         * CREATION D'UNE OU PLUSIEURS TOURNEES DE LIVRAISON
         * @param id Identifiant du planning de livraison
         * @param dtos données des tournées de livraison
         * @returns Tournées de livraison enregistrées
         */
    @Post("/:id/tournees")
        @ApiTags("Tournée de livraison")
        @ApiOperation({summary: "Créer une tournée de livraison pour un planning"})
        @ApiBody({type: [TourneeLivraisonCreateDto]})
    saveTournee(@Param("id", ParseIntPipe) id: number, @Body() dtos: TourneeLivraisonCreateDto[]){
        return this.tourneeService.batchSave(id, dtos);
    }

        /**
         * LISTE DES TOURNEES DE LIVRAISON D'UN PLANNING DE LIVRAISON
         * @param id Identifiant du planning de livraison
         * @return Liste des tournées de livraison 
         */   
    @Get("/:id/tournees")
    getTournees(@Param("id", ParseIntPipe) id: number){
        return this.tourneeService.findAllByPlanning(id);
    }
}
