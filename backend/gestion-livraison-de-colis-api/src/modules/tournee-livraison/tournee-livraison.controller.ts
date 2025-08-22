import { OrdreLivraisonCreateDto } from 'src/common/dto/ordre-livraison/ordre-livraison-dto';
import { Body, Controller, Delete, Get, Param, ParseIntPipe, Post, Put, Query } from '@nestjs/common';
import { ApiBody, ApiOperation, ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';
import { TourneeLivraisonService } from './tournee-livraison.service';
import { TourneeLivraisonCreateDto } from 'src/common/dto/tournee-livraison/create-tournee-livraison-dto';
import { OrdreLivraisonService } from '../ordre-livraison/ordre-livraison.service';
import { TourneePointLivraisonDto } from 'src/common/dto/tournee-livraison/create-tournee-point-livraison-dto';

@Controller('tournees')
@ApiTags("Tournée de livraison")
export class TourneeLivraisonController {
    constructor(
        private readonly tourneeService: TourneeLivraisonService,
        private readonly ordreLivraisonService: OrdreLivraisonService
    ){}

    @Get("/:id")
    getByid(@Param("id", ParseIntPipe) id: number){
        return this.tourneeService.findById(id);
    }

    
    @Put("/:id")
    @ApiBody({type: TourneeLivraisonCreateDto})
    update(@Param("id", ParseIntPipe) id: number, @Body() dto: TourneeLivraisonCreateDto){
        return this.tourneeService.update(id, dto);
    }
    
    @Put("/:id/change-statuts")
    @ApiQuery({type: "Annulé, Planifié, En cours, Terminé, Partiellement exécuté", description: ""})
    changeStatuts(@Param("id", ParseIntPipe) id: number, @Query("statuts") statuts: string){
        return this.tourneeService.changeStatuts(id, statuts);
    }

    @Delete("/:id")
    delete(@Param("id", ParseIntPipe) id: number) {
        return this.tourneeService.deleteDraft(id);
    }  
    
    
    /* -- --- ORDRE DE LIVRAISON --- --- --*/
    @Post("/:id/points-livraison")
    @ApiOperation({ summary: 'Create ordre livraison' })
    @ApiBody({type: TourneePointLivraisonDto})
    @ApiResponse({ status: 201, description: 'Ordre livraison created.' })
    async saveOrdreLivraison(@Param("id", ParseIntPipe) id: number, @Body() dto: TourneePointLivraisonDto){
        const mapped: OrdreLivraisonCreateDto[] = await this.ordreLivraisonService.mapToOrdreLivraisonCreateDTo(id, dto);
        return this.ordreLivraisonService.batchSave(mapped);
    }

    @Get("/:id/ordres-livraison")
    async getOrdresLivraison(@Param("id", ParseIntPipe) id: number){
        return this.ordreLivraisonService.findAllByTournee(id);
    }
}
