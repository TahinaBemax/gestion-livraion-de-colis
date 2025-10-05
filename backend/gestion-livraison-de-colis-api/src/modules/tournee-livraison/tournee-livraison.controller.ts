import { BadRequestException, Body, Controller, Delete, Get, Param, ParseIntPipe, Post, Put, Query } from '@nestjs/common';
import { ApiBody, ApiOperation, ApiQuery, ApiTags } from '@nestjs/swagger';
import { TourneeLivraisonService } from './tournee-livraison.service';
import { TourneeLivraisonCreateDto } from 'src/common/dto/tournee-livraison/create-tournee-livraison-dto';
import { OrdreLivraisonService } from '../ordre-livraison/ordre-livraison.service';

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
        @ApiOperation({summary: "Obtenir un tournée de livraison par ID"})
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
       @ApiOperation({summary: "Modifier un tournée de livraison"})
    update(@Param("id", ParseIntPipe) id: number, @Body() dto: TourneeLivraisonCreateDto){
        return this.tourneeService.update(id, dto);
    }
    
        /**
         * MODIFICATION DU STATUT D'UNE TOURNEE DE LIVRAISON
         * @param id Identifiant de la tournée de livraison
         * @param statuts Nouveau statut de la tournée de livraison
         * @returns Tournée de livraison modifiée
         */
    @Put("/:id/change-statut")
        @ApiQuery({type: "Annulé, Planifié, En cours, Terminé, Partiellement exécuté"})
        @ApiOperation({summary: "Modifier le statut d'un tournée de livraison"})
    changeStatuts(@Param("id", ParseIntPipe) id: number, @Query("statut") statut: string){
        return this.tourneeService.changeStatuts(id, statut);
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
         * LISTE DES ORDRES DE LIVRAISON D'UNE TOURNEE DE LIVRAISON
         * @param id Identifiant de la tournée de livraison
         * @return Liste des ordres de livraison 
         */
    @Get("/:id/ordres-livraison")
        @ApiOperation({summary: "Liste des ordres de livraison afin de génerer un Bordereau de Livraison pour un tournée donnée"})
    async getOrdresLivraison(@Param("id", ParseIntPipe) id: number){
        return this.ordreLivraisonService.findAllByTournee(id);
    }

        /**
         * LISTE DES LIVRAISONs D'UNE TOURNEE DE LIVRAISON
         * @param id Identifiant de la tournée de livraison
         * @return Liste des ordres de livraison 
         */
    @Get("/:id/livraisons")
    @ApiTags("Livraison")
    @ApiOperation({summary: "Liste des livraison à charger/decharger dans le camion", description: "Liste des ordres de livraison en ordre inverse"})
    @ApiQuery({description: "Etape de livraison", example: "chargement ou dechargement"})
    async getLivraisons(
        @Query("etape") etape:string,
        @Param("id", ParseIntPipe) id: number)
    {
        if(etape === "chargement"){
            return this.tourneeService.invertedOrdreLivraison(id);
        } else if(etape === "dechargement") {
            return this.tourneeService.ordreLivraisonOrderByPointLivraison(id);
        } else {
            throw new BadRequestException("Valeur du variable etape inconnu! Valeur accepté: chargement ou dechargement");
        }
    }
}
