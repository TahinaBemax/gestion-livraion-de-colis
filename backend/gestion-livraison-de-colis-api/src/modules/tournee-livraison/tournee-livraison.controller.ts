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

        /**
         * DETAIL D'UNE TOURNEE DE LIVRAISON
         * @param id ID de la tournée de livraison
         * @returns Tournée de livraison
         */
    @Get("/:id")
    getByid(@Param("id", ParseIntPipe) id: number){
        return this.tourneeService.findById(id);
    }

    
        /**
         * MODIFICATION D'UNE TOURNEE DE LIVRAISON
         * @param id Identifiant de la tournée de livraison
         * @param dto Donnée de la tournée de livraison
         * @returns Tournée de livraison modifiée
         */
    @Put("/:id")
        @ApiBody({type: TourneeLivraisonCreateDto})
    update(@Param("id", ParseIntPipe) id: number, @Body() dto: TourneeLivraisonCreateDto){
        return this.tourneeService.update(id, dto);
    }
    
        /**
         * MODIFICATION DU STATUT D'UNE TOURNEE DE LIVRAISON
         * @param id Identifiant de la tournée de livraison
         * @param statuts Nouveau statut de la tournée de livraison
         * @returns Tournée de livraison modifiée
         */
    @Put("/:id/change-statuts")
        @ApiQuery({type: "Annulé, Planifié, En cours, Terminé, Partiellement exécuté", description: ""})
    changeStatuts(@Param("id", ParseIntPipe) id: number, @Query("statuts") statuts: string){
        return this.tourneeService.changeStatuts(id, statuts);
    }

        /**
         * SUPPRESSION D'UNE TOURNEE DE LIVRAISON
         * @param id Identifiant de la tournée de livraison
         * @returns Tournée de livraison supprimée
         */
    @Delete("/:id")
    delete(@Param("id", ParseIntPipe) id: number) {
        return this.tourneeService.deleteDraft(id);
    }  
    /* -- ---  --- --- --*/
    
    
    /* -- --- ORDRE DE LIVRAISON --- --- --*/

        /**
         * CREATION D'UN OU PLUSIEURS ORDRES DE LIVRAISON
         * @param id Identifiant de la tournée de livraison
         * @param dto Données des points de livraison
         * @returns Ordres de livraison enregistrés
         */
    @Post("/:id/points-livraison")
        @ApiOperation({ summary: 'Create ordre livraison' })
        @ApiBody({type: TourneePointLivraisonDto})
        @ApiResponse({ status: 201, description: 'Ordre livraison created.' })
    async saveOrdreLivraison(@Param("id", ParseIntPipe) id: number, @Body() dto: TourneePointLivraisonDto){
        const mapped: OrdreLivraisonCreateDto[] = await this.ordreLivraisonService.mapToOrdreLivraisonCreateDTo(id, dto);
        return this.ordreLivraisonService.batchSave(mapped);
    }

        /**
         * LISTE DES ORDRES DE LIVRAISON D'UNE TOURNEE DE LIVRAISON
         * @param id Identifiant de la tournée de livraison
         * @return Liste des ordres de livraison 
         */
    @Get("/:id/ordres-livraison")
    async getOrdresLivraison(@Param("id", ParseIntPipe) id: number){
        return this.ordreLivraisonService.findAllByTournee(id);
    }
}
