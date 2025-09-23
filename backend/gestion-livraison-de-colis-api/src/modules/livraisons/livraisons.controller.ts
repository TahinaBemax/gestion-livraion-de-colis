import { Body, Controller, Get, HttpCode, HttpStatus, Param, ParseIntPipe, Post, Put, Query } from '@nestjs/common';
import { LivraisonsService } from './livraisons.service';
import { LivraisonCreateDto } from 'src/common/dto/livraison/create-livraison-dto';
import { ApiBadRequestResponse, ApiBody, ApiCreatedResponse, ApiNotFoundResponse, ApiOperation, ApiQuery, ApiTags } from '@nestjs/swagger';
import { Roles, UserTypes } from 'src/common/decorators/roles.decorator';
import { UserRole } from 'src/common/enum/user-role.enum';
import { LivraisonUpdateDto } from 'src/common/dto/livraison/update-livraison-dto';
import { LivraisonEntity } from './livraison.entity';
import { StatusLivraison } from 'src/common/enum/status-livraison.enum';
import { TypeUtilisateur } from 'src/common/enum/type-utilisateur.enum';

@Controller('livraisons')
@ApiTags("Livraison")
@Roles(UserRole.Admin)
@UserTypes(TypeUtilisateur.TempoOne)
export class LivraisonsController {
    constructor(
        private readonly livraisonService: LivraisonsService
    ){}
    
    /**
     * LISTE DES LIVRAISON EFFECTUES ET EN COURS DE TRAITEMENT
     * @returns Liste des livraisons
     */
    @Get("/historique")
    async getLivraisonsEncoursEtLivre(): Promise<LivraisonEntity[]>{
        const statuts: StatusLivraison[] = [
            StatusLivraison.LIVRE, 
            StatusLivraison.DISTRIBUEUR_ASSIGNÉ, 
            StatusLivraison.EN_COURS_LIVRAISON, 
            StatusLivraison.EN_EXPEDIE, 
            StatusLivraison.EN_TRANSIT, 
        ];

        return this.livraisonService.findByStatuts(statuts);
    }

    // /**
    //  * LISTE DES LIVRAISON EFFECTUES ET EN COURS DE TRAITEMENT
    //  * @returns Liste des livraisons
    //  */
    // @Get("/:id/scan-colis")
    // async scanColis(@Param("id", ParseIntPipe) id: number): Promise<LivraisonEntity | null>{
    //     return this.livraisonService.getLivraisonAndCountColis(id);
    // }

    /**
     * FILTRE LES LIVRAISON PAR Prestataire, Client, Date de livraison 
     * @returns Liste des livraisons
     */
    @Get("/filtre")
        @ApiOperation({description: "Filtré les livraisons par Prestataire, Client, Date de livraison et Zone Geographique(Code postal ou Ville)"})
        @ApiQuery({name: "idPrestataire", required: false})
        @ApiQuery({name: "idClient", required: false})
        @ApiQuery({name: "dateLivraison", required: false})
        @ApiQuery({name: "zoneGeographique", required: false})
    async filterby(
        @Query("idPrestataire") idPrestataire?: string|undefined, 
        @Query("idClient") idClient?: string|undefined,
        @Query("dateLivraison") dateLivraison?: string|undefined,
        @Query("zoneGeographique") zoneGeographique?: string|undefined,
    ): Promise<LivraisonEntity[]>
    {

        return this.livraisonService.filterBy(idPrestataire, idClient, dateLivraison, zoneGeographique);
    }

    /**
     * LISTE DES LIVRAISONS
     * @returns Liste des livraisons
     */
    @Get()
    async getAll(){
        return this.livraisonService.findAll();
    }
    
    @Get("/:id")
    @Roles(UserRole.Admin, UserRole.ResponsableExploitation, UserRole.User)
    @UserTypes(TypeUtilisateur.Livreur, TypeUtilisateur.TempoOne, TypeUtilisateur.Prestataire)
    async getById(@Param("id", ParseIntPipe) id: number){
        return this.livraisonService.findById(id);
    }

    /**
     * CREER UN LIVRAISON
     * @param dto 
     * @returns Liste des livraisons
     */
    @Post()
    @HttpCode(HttpStatus.CREATED)
        @ApiBody({type: LivraisonCreateDto})
        @ApiOperation({description: "Créer un livraison avec colis"})
        @ApiBadRequestResponse()
        @ApiCreatedResponse()
    save(@Body() dto: LivraisonCreateDto){
        return this.livraisonService.save(dto);
    }

    /**
     * MODIFIER UN LIVRAISON
     * @param id ID du livraison
     * @param dto 
     * @returns Liste des livraisons
     */
    @Put("/:id")
    @HttpCode(HttpStatus.CREATED)
    @ApiBody({type: LivraisonCreateDto})
    @ApiCreatedResponse()
    @ApiBadRequestResponse()
    @ApiNotFoundResponse()
    update(@Param("id", ParseIntPipe) id: number, @Body() dto: LivraisonUpdateDto){
        return this.livraisonService.update(id, dto);
    }

    /**
     * CHANGER LE STATUT D'UN LIVRAISON
     * @param statut
     * @param id 
     * @returns Un message
     */
    @Put("/:id/statut")
    @HttpCode(HttpStatus.CREATED)
    @ApiCreatedResponse()
    @ApiBadRequestResponse()
    @ApiNotFoundResponse()
    changeStatuts(@Param("id", ParseIntPipe) id: number, @Query("statut") statut: string){
        return this.livraisonService.updateStatut(id, statut);
    }
}
