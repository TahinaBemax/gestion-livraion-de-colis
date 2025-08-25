import { TourneeLivraisonCreateDto } from 'src/common/dto/tournee-livraison/create-tournee-livraison-dto';
import { PlanningLivraisonCreateDto } from 'src/common/dto/planning-livraison/create-planning-dto';
import { Body, Controller, Delete, Get, Param, ParseIntPipe, Post, Put, Query } from '@nestjs/common';
import { PlanningLivraisonService } from './planning-livraison.service';
import { ApiBody, ApiQuery, ApiTags } from '@nestjs/swagger';
import { TourneeLivraisonService } from '../tournee-livraison/tournee-livraison.service';

@Controller('plannings')
@ApiTags("Plannings Livraison")
export class PlanningLivraisonController {
    constructor(
        private readonly planningService: PlanningLivraisonService,
        private readonly tourneeService: TourneeLivraisonService
    ){}

    @Get()
    getAll(){
        return this.planningService.findAll();
    }

    @Get("/:id")
    getByid(@Param("id", ParseIntPipe) id: number){
        return this.planningService.findById(id);
    }

    @Post()
    @ApiBody({type: PlanningLivraisonCreateDto})
    saveDraft(@Body() dto: PlanningLivraisonCreateDto){
        return this.planningService.saveDraftPlanning(dto);
    }
    
    @Put("/:id")
    @ApiBody({type: PlanningLivraisonCreateDto})
    update(@Param("id", ParseIntPipe) id: number, @Body() dto: PlanningLivraisonCreateDto){
        return this.planningService.updatePlanning(id, dto);
    }
    
    @Put("/:id/change-statut")
    @ApiQuery({type: "Annulé, Planifié, En cours, Terminé, Partiellement exécuté", description: "Change le statut d'un planning livraison!"})
    changeStatuts(@Param("id", ParseIntPipe) id: number, @Query("statut") statut: string){
        return this.planningService.changeStatuts(id, statut);
    }

    @Delete("/:id")
    delete(@Param("id", ParseIntPipe) id: number) {
        return this.planningService.deletePlanning(id);
    }


    /* TOURNEE DE LIVRAISON */
    @Post("/:id/tournees")
    @ApiBody({type: [TourneeLivraisonCreateDto]})
    saveTournee(@Param("id", ParseIntPipe) id: number, @Body() dtos: TourneeLivraisonCreateDto[]){
        return this.tourneeService.batchSave(id, dtos);
    }

    @Get("/:id/tournees")
    getTournees(@Param("id", ParseIntPipe) id: number){
        return this.tourneeService.findAllByPlanning(id);
    }
}
