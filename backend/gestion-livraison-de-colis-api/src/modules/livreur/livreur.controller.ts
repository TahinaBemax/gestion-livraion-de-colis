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
import { SameLivreurGuard } from 'src/common/guards/same-livreur.guard';

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
   @Get("/:idLivreur/statisitque")
   @UseGuards(SameLivreurGuard)
        @Roles(UserRole.User, UserRole.ResponsableExploitation, UserRole.Admin)
        @UserTypes(TypeUtilisateur.Livreur, TypeUtilisateur.Prestataire, TypeUtilisateur.TempoOne)
        @ApiOperation({summary: "Lister tous les livreurs"})
        @ApiOkResponse({description: "Ok", type: [LivreurSwaggerDto]})
    async livreurScoringClassement(@Param("idLivreur", ParseIntPipe) idLiveur: number, @Query("date_tournee") date_tournee?:string){
        if(!date_tournee){
            date_tournee = new Date().toISOString().split('T')[0];
        }
        return await this.livreurService.getLivreurStatistique(idLiveur, date_tournee);
    }
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
    @Put("/:idLivreur")
    @UseGuards(SameLivreurGuard)
        @Roles(UserRole.User)
        @ApiBody({type: LivreurUpdateDto})
        @ApiOperation({summary: "modification d'un livreur"})
        @ApiCreatedResponse({description: "Livreur modifié avec succés!", type: LivreurSwaggerDto})
        @ApiBadRequestResponse({description: "Données invalides"})
    async updateLivreur(@Param("idLivreur") idLivreur: number, @Body() data: LivreurUpdateDto): Promise<Livreur>{
        return this.livreurService.update(idLivreur, data);
    }
    /* -------------------------------- */


    
    /* LIVREUR TEMPORAIRE */
        /**
         * LISTE DES LIVREURS TEMPORAIRES D'UN LIVREUR
         * @param id ID du livreur parent
         * @returns 
         */
    @Get("/:idLivreur/temporaire")
    @UseGuards(SameUserGuard)
        @ApiTags("Livreur Temporaraire")
        @ApiOperation({summary: "Lister les livreurs temporaraires d'un Livreur Ponctuel"})
        @ApiParam({name: "id", description: "ID Utilisateur mais non ID livreur!" })
    async getAllByDeliveryID(@Param("idLivreur", ParseIntPipe) id: number): Promise<LivreurTemporaireEntity[]>{
        return this.livreurTempService.findByLivreurID(id);
    }
        /**
         * RECUPERER UN LIVREUR TEMPORAIRE PAR SON ID
         * @param id ID du livreur temporaire
         * @returns Livreur temporaire
         */
    @Get("/:idLivreur/temporaire/:idTemp")
        @ApiTags("Livreur Temporaraire")
        @ApiNotFoundResponse()
    async getByIdTemporaryDeliveryID(@Param("idLivreur", ParseIntPipe) id: number){
        return this.livreurTempService.findById(id);
    }

    /**
     * CREATION D'UN LIVREUR TEMPORAIRE
     * @param id ID du livreur parent
     * @param dto Données du livreur temporaire
     * @returns Livreur temporaire créé
     */
    @Post('/:idLivreur/temporaire')
    @UseGuards(SameLivreurGuard)
        @ApiCreatedResponse()
        @ApiBody({type: LivreurTemporaireDto})
        @ApiTags("Livreur Temporaraire")
        @ApiOperation({summary: "Créer un livreur temporaraire"})
        @ApiParam({name: "idLivreur", description: "ID Utilisateur mais non ID Livreur"})
    async save(@Param("idLivreur", ParseIntPipe) id: number, @Body() dto: LivreurTemporaireDto): Promise<LivreurTemporaireEntity>{
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
    @UseGuards(SameLivreurGuard)
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
    @Post("/:idLivreur/livraisons/:idLivraison/cloture")
        @ApiTags("Livraison")
        @ApiOperation({summary: "Clôturer un livraison"})
        @UseGuards(SameLivreurGuard)
    async clotureLivraison(@Param("idLivreur", ParseIntPipe) id: number, @Param("idLivraison", ParseIntPipe) idLivraison: number){
        return this.livraisonService.cloturerLivraison(id, idLivraison);
    }

    /* ===== NOTIFICATION ====== */
        /**
         * @param id ID du livreur
         * LISTE DES NOTIFICATION D'UN LIVREUR
         * @returns Liste Notifications
        */
    @Get("/:idLivreur/notifications")
        @UseGuards(SameLivreurGuard)
        @ApiTags("Notification")
    async getNotifications(@Param("idLivreur", ParseIntPipe) id: number){
        return this.notifService.findLivreurNotifications(id);
    }

    @Post("/:idLivreur/colis/:idColis")
        @UseGuards(SameLivreurGuard)
        @ApiTags("Chargement et Dechargement Camion")
        @ApiOperation({summary: "Scan du colis au moment du chargement du Camion"})
        @ApiParam({name: "idLivreur", description: "ID Utilisateur mais non pas l'ID du livreur"})
        @ApiParam({name: "idColis", description: "ID du colis"})
        @ApiQuery({name: "etape", description: "Etape de livraison", example: "chargement ou dechargement"})
    async scann(
        @Param("idLivreur", ParseIntPipe) id: number,
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
     * Voir le detail d'un colis pour verifier si le colis est bien livré à la bonne personne
     * @param ididLivreur 
     * @param idColis 
     * @returns 
     */
    @Get("/:idLivreur/colis/:idColis/fiche-colis")
        @UseGuards(SameLivreurGuard)
        @ApiTags("Chargement et Dechargement Camion")
        @ApiOperation({summary: "Voir le detail d'un colis pour verifier si le colis est bien livré à la bonne personne"})
        @ApiParam({name: "idLivreur", description: "ID Utilisateur mais non pas l'ID du livreur"})
        @ApiParam({name: "idColis", description: "ID du colis"})
    async ficheDetail(
        @Param("idLivreur", ParseIntPipe) idLivreur: number,
        @Param("idColis", ParseIntPipe) idColis: number
    ){
        return this.colisService.getFicheColis(idLivreur, idColis);        
    }


        /**
         * LISTE DES LIVRAISONs D'UNE TOURNEE DE LIVRAISON
         * @param id Identifiant de la tournée de livraison
         * @return Liste des ordres de livraison 
         */
    @Get("/:id/tournees/:idTournee/livraisons")
    @ApiTags("Chargement et Dechargement Camion")
    @ApiOperation({summary: "Liste des livraison à charger/trajet/decharger dans le camion", description: "Liste des ordres de livraison en ordre inverse"})
    @ApiQuery({name: "etape", description: "Etape de livraison", example: "chargement, trajet ou dechargement"})
    @ApiParam({name: "idTournee", description: "ID De l'utilisateur"})
    async getLivraisons(
        @Query("etape") etape:string,
        @Param("idTournee", ParseIntPipe) id: number)
    {
        if(etape === "chargement"){
            return this.tourneeService.invertedOrdreLivraison(id);
        } else if(etape === "trajet") {
            return this.tourneeService.tranjet(id);
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
