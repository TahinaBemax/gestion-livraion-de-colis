import { ColisService } from 'src/modules/colis/colis.service';
import { BadRequestException, Body, Controller, Delete, Get,Param, ParseIntPipe, Post, Put, Query, UseGuards } from '@nestjs/common';
import { ApiBadRequestResponse, ApiBody, ApiCreatedResponse, ApiNotFoundResponse, ApiOkResponse, ApiOperation, ApiParam, ApiQuery, ApiTags } from '@nestjs/swagger';
import { LivreurTemporaireService } from './livreur-temporaire/livreur-temporaire.service';
import { LivreurTemporaireDto } from 'src/common/dto/livreur/livreur-temporaire-dto';
import { LivreurTemporaireUpdateDto } from 'src/common/dto/livreur/update-livreur-temporaire-dto';
import { LivreurSwaggerDto } from 'src/common/swagger-dto/livreur/livreur-swagger-dto';
import { LivreurUpdateDto } from 'src/common/dto/livreur/update-livreur-dto';
import { LivreurService } from './livreur.service';
import { LivreurTemporaireEntity } from './livreur-temporaire/livreur-temporaire.entity';
import { Livreur } from './livreur.entity';
import { Roles, UserTypes } from 'src/common/decorators/roles.decorator';
import { UserRole } from 'src/common/enum/user-role.enum';
import { TypeUtilisateur } from 'src/common/enum/type-utilisateur.enum';
import { LivraisonsService } from '../livraisons/livraisons.service';
import { NotificationService } from '../notification/notification.service';
import { SameUserGuard } from 'src/common/guards/same-user.guard';
import { TourneeLivraisonService } from '../tournee-livraison/tournee-livraison.service';

@Controller('livreurs')
@Roles(UserRole.User, UserRole.ResponsableExploitation)
@UserTypes(TypeUtilisateur.Livreur, TypeUtilisateur.Prestataire)
@ApiTags("Livreur")
export class LivreurController {
    constructor(
        private readonly livreurTempService: LivreurTemporaireService,
        private readonly livreurService: LivreurService,
        private readonly livraisonService: LivraisonsService,
        private readonly colisService: ColisService,
        private readonly notifService: NotificationService,
        private readonly tourneeService: TourneeLivraisonService,
    ){}

    /* LIVREUR */
    
        /**
         * LISTE DES LIVREURS
         * @returns Liste des livreurs
        */
   @Get()
        @Roles(UserRole.User, UserRole.ResponsableExploitation, UserRole.Admin)
        @UserTypes(TypeUtilisateur.Livreur, TypeUtilisateur.Prestataire, TypeUtilisateur.TempoOne)
        @ApiOperation({summary: "Lister tous les livreurs"})
        @ApiOkResponse({description: "Ok", type: [LivreurSwaggerDto]})
    async findLivreurs(){
        return this.livreurService.findAllLivreurs();
    }

        /**
         * DETAIL D'UN LIVREUR PAR SON ID
         * @param id ID du livreur
         * @returns Livreur
        */
    @Get("/:id")
        @Roles(UserRole.ResponsableExploitation, UserRole.User, UserRole.Admin)
        @UserTypes(TypeUtilisateur.Livreur, TypeUtilisateur.Prestataire, TypeUtilisateur.TempoOne)
        @ApiOkResponse()
        @ApiNotFoundResponse()
    async getByID(@Param("id", ParseIntPipe) id: number): Promise<Livreur>{
        return this.livreurService.findById(id);
    }

        /**
         * Lister les livreurs qui ont déjà scanné un bordereau et qui ont une tournée aujourd'hui
         * @param id ID du livreur
         * @returns Livreur
        */
    @Get("/en-trajet")
        @ApiOperation({summary: "Lister les livreurs qui ont déjà scanné un bordereau et qui ont une tournée aujourd'hui"})
        @Roles(UserRole.ResponsableExploitation, UserRole.User, UserRole.Admin)
        @UserTypes(TypeUtilisateur.Prestataire, TypeUtilisateur.TempoOne)
    async getLivreurEncoursLivraison(): Promise<Livreur[]>{
        return this.livreurService.findLivreurEncoursLivraison();
    }

        /**
         * MODIFICATION D'UN LIVREUR
         * @param idLivreur ID du livreur à modifier
         * @param data 
         * @returns 
         */
    @Put("/:id")
    @UseGuards(SameUserGuard)
        @Roles(UserRole.Admin, UserRole.User)
        @ApiBody({type: LivreurUpdateDto})
        @ApiOperation({summary: "modification d'un livreur"})
        @ApiCreatedResponse({description: "Livreur modifié avec succés!", type: LivreurSwaggerDto})
        @ApiBadRequestResponse({description: "Données invalides"})
    async updateLivreur(@Param("id") idLivreur: number, @Body() data: LivreurUpdateDto): Promise<Livreur>{
        return this.livreurService.update(idLivreur, data);
    }
    /* -------------------------------- */


    
    /* LIVREUR TEMPORAIRE */
        /**
         * LISTE DES LIVREURS TEMPORAIRES D'UN LIVREUR
         * @param id ID du livreur parent
         * @returns 
         */
    @Get("/:id/temporaire")
    @UseGuards(SameUserGuard)
        @ApiTags("Livreur Temporaraire")
        @ApiOperation({summary: "Lister les livreurs temporaraires d'un Livreur Ponctuel"})
        @ApiParam({name: "id", description: "ID Utilisateur mais non ID livreur!" })
    async getAllByDeliveryID(@Param("id", ParseIntPipe) id: number): Promise<LivreurTemporaireEntity[]>{
        return this.livreurTempService.findByLivreurID(id);
    }
        /**
         * RECUPERER UN LIVREUR TEMPORAIRE PAR SON ID
         * @param id ID du livreur temporaire
         * @returns Livreur temporaire
         */
    @Get("/:id/temporaire/:idTemp")
        @ApiTags("Livreur Temporaraire")
        @ApiNotFoundResponse()
    async getByIdTemporaryDeliveryID(@Param("id", ParseIntPipe) id: number){
        return this.livreurTempService.findById(id);
    }

    /**
     * CREATION D'UN LIVREUR TEMPORAIRE
     * @param id ID du livreur parent
     * @param dto Données du livreur temporaire
     * @returns Livreur temporaire créé
     */
    @Post('/:id/temporaire')
    @UseGuards(SameUserGuard)
        @ApiCreatedResponse()
        @ApiBody({type: LivreurTemporaireDto})
        @ApiTags("Livreur Temporaraire")
        @ApiOperation({summary: "Créer un livreur temporaraire"})
        @ApiParam({name: "id", description: "ID Utilisateur mais non ID Livreur"})
    async save(@Param("id", ParseIntPipe) id: number, @Body() dto: LivreurTemporaireDto): Promise<LivreurTemporaireEntity>{
        return this.livreurTempService.save(id, dto);
    }

        /**
         * MODIFICATION D'UN LIVREUR TEMPORAIRE
         * @param id ID du livreur parent
         * @param idLivreurTemp ID du livreur temporaire à modifier
         * @param dto Données à modifier
         * @returns Livreur temporaire modifié
         */
    @Put('/:idLiveur/temporaire/:idLivreurTemp')
    @UseGuards(SameUserGuard)
        @ApiBody({type: LivreurTemporaireUpdateDto})
        @ApiTags("Livreur Temporaraire")
        @ApiOperation({summary: "Modifier un Livreur temporaraire"})
    async update(
        @Param("idLiveur", ParseIntPipe) idLiveur:number,
        @Param("idLivreurTemp", ParseIntPipe) idLivreurTemp:number, @Body() dto: LivreurTemporaireUpdateDto
    ){
        return this.livreurTempService.update(idLivreurTemp, dto);
    }

        /**
         * DESACTIVATION D'UN LIVREUR TEMPORAIRE
         * @param id ID du livreur temporaire à désactiver
         * @returns MESSAGE de succès
         */
    @Delete('/temporaire/:id')
        @ApiBody({type: LivreurTemporaireUpdateDto})
        @ApiNotFoundResponse()
        @ApiTags("Livreur Temporaraire")
    async desactivateAccount(@Param("id", ParseIntPipe) id: number){
        return this.livreurTempService.delete(id);
    }

    /* ===== LIVRAISON ====== */
    // @Post("/:id/livraisons/:idLivraison/problemes")
    //     @ApiTags("Livraison")
    //     @ApiOperation({summary: "Signaler un problemes lors de livraison"})
    //     @UseGuards(SameUserGuard)
    //     @HttpCode(HttpStatus.CREATED)
    //     @ApiBody({type: ProblemeLivraisonCreateDto})
    //     @ApiCreatedResponse()
    //     @ApiBadRequestResponse()
    // async signalProbleme(@Param("id", ParseIntPipe) idLivraison: number, @Body() dto: ProblemeLivraisonCreateDto){
    //     return this.livraisonService.signalProbleme(idLivraison, dto);
    // }

    /* ===== NOTIFICATION ====== */
        /**
         * @param id ID du livreur
         * LISTE DES NOTIFICATION D'UN LIVREUR
         * @returns Liste Notifications
        */
    @Get("/:id/notifications")
        @UseGuards(SameUserGuard)
        @ApiTags("Notification")
    async getNotifications(@Param("id", ParseIntPipe) id: number){
        return this.notifService.findLivreurNotifications(id);
    }

    @Post("/:id/colis/:idColis")
        @UseGuards(SameUserGuard)
        @ApiTags("Chargement et Dechargement Camion")
        @ApiOperation({summary: "Scan du colis au moment du chargement du Camion"})
        @ApiParam({name: "id", description: "ID Utilisateur mais non pas l'ID du livreur"})
        @ApiParam({name: "idColis", description: "ID du colis"})
        @ApiQuery({name: "etape", description: "Etape de livraison", example: "chargement ou dechargement"})
    async scann(
        @Param("id", ParseIntPipe) id: number,
        @Param("idColis", ParseIntPipe) idColis: number,
        @Query("etape") etape:string
    ){
        if(etape === "chargement"){
            return this.colisService.scanColisAuChargementCamion(id, idColis);        
        } else if(etape === "dechargement") {
            return this.colisService.scanColisAuDechargementCamion(id, idColis);
        } else {
            throw new BadRequestException("Valeur du variable etape inconnu! Valeur accepté: chargement ou dechargement");
        }
    }


        /**
         * LISTE DES LIVRAISONs D'UNE TOURNEE DE LIVRAISON
         * @param id Identifiant de la tournée de livraison
         * @return Liste des ordres de livraison 
         */
    @Get("/:id/tournees/:idTournee/livraisons")
    @ApiTags("Chargement et Dechargement Camion")
    @ApiOperation({summary: "Liste des livraison à charger/decharger dans le camion", description: "Liste des ordres de livraison en ordre inverse"})
    @ApiQuery({name: "etape", description: "Etape de livraison", example: "chargement ou dechargement"})
    @ApiParam({name: "idTournee", description: "ID De l'utilisateur"})
    async getLivraisons(
        @Query("etape") etape:string,
        @Param("idTournee", ParseIntPipe) id: number)
    {
        if(etape === "chargement"){
            return this.tourneeService.invertedOrdreLivraison(id);
        } else if(etape === "dechargement") {
            return this.tourneeService.ordreLivraisonOrderByPointLivraison(id);
        } else {
            throw new BadRequestException("Valeur du variable etape inconnu! Valeur accepté: chargement ou dechargement");
        }
    }

            /**
         * LISTE DES COLIS D'UNE LIVRAISON
         * @param id Identifiant de la tournée de livraison
         * @return Liste des ordres de livraison 
         */
    @Get("/:id/tournees/:idTournee/livraisons/:idLivraison/colis")
        @ApiTags("Chargement et Dechargement Camion")
        @ApiOperation({summary: "Liste des colis d'un livraison à charger dans le camion"})
        @ApiParam({name: "id", description: "ID De l'utilisateur"})
        @ApiParam({name: "idTournee", description: "ID Du tournee de livraison"})
        @ApiParam({name: "idLivraison", description: "ID De l'ordre de livraison"})
    async getColisByIdLivraison(
        @Param("idTournee", ParseIntPipe) idTournee: number,
        @Param("id", ParseIntPipe) idUser: number,
        @Param("idLivraison", ParseIntPipe) idLivraison: number)
    {
        return this.tourneeService.getListColisByIDLivraison(idTournee, idLivraison, idUser);
    }
}
