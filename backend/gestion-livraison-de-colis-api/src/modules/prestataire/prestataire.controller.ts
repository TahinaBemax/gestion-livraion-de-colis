import { BadRequestException, Body, Controller, Delete, Get, Param, ParseBoolPipe, ParseIntPipe, Post, Put, Query} from '@nestjs/common';
import { PrestataireService } from './prestataire.service';
import { CreateLivreurDto } from 'src/common/dto/livreur/create-livreur-dto';
import { LivreurService } from '../livreur/livreur.service';
import { UserRole } from 'src/common/enum/user-role.enum';
import { Roles, UserTypes } from 'src/common/decorators/roles.decorator';
import { PointLivraisonService } from '../point-livraison/point-livraison.service';
import { ApiBadRequestResponse, ApiBody, ApiCreatedResponse, ApiInternalServerErrorResponse, ApiNotFoundResponse, ApiOkResponse, ApiOperation, ApiParam, ApiQuery, ApiTags } from '@nestjs/swagger';
import { PrestataireSwaggerDto } from 'src/common/swagger-dto/prestataire/prestataire-swagger-dto';
import { LivreurSwaggerDto } from 'src/common/swagger-dto/livreur/livreur-swagger-dto';
import { UserSwaggerDto } from 'src/common/swagger-dto/user/user-swagger-dto';
import { PointLivraisonSwaggerDto } from 'src/common/swagger-dto/point-livraison/point-livraison-swagger-dto';
import { CreateUserDto } from 'src/common/dto/create-user-dto';
import { User } from '../user/user.entity';
import { UserService } from '../user/user.service';
import { UpdateUserDto } from 'src/common/dto/update-user-dto';
import { TypeUtilisateur } from 'src/common/enum/type-utilisateur.enum';
import { OrdreLivraisonService } from '../ordre-livraison/ordre-livraison.service';
import { NotificationService } from '../notification/notification.service';
import { PrestataireCreateDto } from 'src/common/dto/prestataire/create-prestataire-dto';
import { PrestataireUpdateDto } from 'src/common/dto/prestataire/update-prestataire-dto';
import { Prestataire } from './prestataire.entity';


@Controller('prestataires')
@Roles(UserRole.Admin)
@UserTypes(TypeUtilisateur.Prestataire)
export class PrestataireController {
    constructor(
        private readonly prestataireService: PrestataireService,
        private readonly livreurService: LivreurService,
        private readonly plService: PointLivraisonService,
        private readonly userService: UserService,
        private readonly ordreLivraisonService: OrdreLivraisonService,
        private readonly notificationService: NotificationService,
    ){}

    /* UTILISATEUR PRESTATAIRE */

    /**
     * Creation d'un utilisateur prestataire
     * @param id ID du prestataire
     * @param dto 
     * @returns User
     */
    @Post("/:id/users")
    @ApiBody({type: CreateUserDto})
    @ApiOperation({summary: "Creation d'un utilisateur prestataire"})
    @ApiCreatedResponse({type: UserSwaggerDto, description: "Utilisateur a été crée avec succés!"})
    @ApiBadRequestResponse({description: "Données invalides"})
    createUser(@Param("id", ParseIntPipe) id: number, @Body() dto: CreateUserDto): Promise<User> {
        return this.userService.savePrestataireUser(id, dto);
    }    
  

        /**
         * LISTE DES UTILISATEURS ACTIVES DES PRESTATAIRES
         * @returns Liste des utilisateurs actives
         */
    @Get("/users")
        @ApiOperation({summary: "Liste des utilisateurs actives des prestataires"})
        @ApiOkResponse({description: "Ok", type: [UserSwaggerDto]})
    findPrestataireUsers(): Promise<User[]> {
        return this.userService.findPrestataireUsers();
    }

        /**
         * LISTE DES UTILISATEURS PRESTATAIRE ACTIVES FILTRE PAR PRENOM, NOM, ROLE ET ENTREPRISE
         * @param nom 
         * @param prenom 
         * @param role 
         * @param nomEntreprise 
         * @returns Liste des utilisateurs filtrés
         */
    @Get('/users/filterBy')
        @ApiQuery({name: "nom", required: false})
        @ApiQuery({name: "prenom", required: false})
        @ApiQuery({name: "role", required: false})
        @ApiQuery({name: "nomEntreprise", required: false})
        @ApiOperation({summary: "Liste des utilisateurs Prestataire, ils peuvent être filtré par prénom, nom, rôle et le nom de l'entreprise"})
        @ApiOkResponse({description: "Ok", type: [UserSwaggerDto]})
    filterBy
    (
        @Query('nom') nom?:string, 
        @Query('prenom') prenom?:string, 
        @Query('role') role?:string, 
        @Query('nomEntreprise') nomEntreprise?:string
    ): Promise<User[]> {
        return this.userService.filterBy(nom, prenom, role, nomEntreprise);
    }

    /**
     * LISTER LES UTILISATEURS D'UN PRESTATAIRE, et peut être filtré par ID Prestataire, nom, prenom, role
     * @param id ID du prestataire
     * @param nom Filtrer par nom
     * @param prenom Filtrer par prénom
     * @param role Filtrer par rôle
     * @returns Liste des utilisateurs prestataires
     */   
    @Get("/:id/users")
    @ApiOperation({summary: "Lister les utilisateurs actives d'un specifique prestataire et peut être filtré par nom, prenom, role"})
    @ApiOkResponse({description: "Ok", type: [UserSwaggerDto]})
    @ApiInternalServerErrorResponse({description: "Internal server error"})
    findAllUsers(@Param("id", ParseIntPipe) id: number, @Query('nom') nom?:string, @Query('prenom') prenom?:string, @Query('role') role?:string): Promise<User[]> {
        if(!id) throw new BadRequestException("ID Prestataire est obligatoire");
        return this.userService.prestataireUsersfilterBy(id, nom, prenom, role);
    }
    /* ---- ---- ---- --- --- -- */


    /* PRESTATAIRE */
        /**
         * CREATION D'UN COMPTE PRESTATAIRE
         * @param data Data de création d'un prestataire
         * @returns Prestataire créé
         */
    @Post()
    @UserTypes(TypeUtilisateur.TempoOne)
        @ApiBody({type: PrestataireCreateDto})
        @ApiOperation({summary: "Créer un prestataire"})
        @ApiOkResponse({description: "Ok", type: PrestataireSwaggerDto})
        @ApiBadRequestResponse({description: "Données invalides, Réessayé"})
    createPrestataire(@Body() data: PrestataireCreateDto): Promise<Prestataire> {
        return this.prestataireService.create(data);
    }
        
        /**
         * LISTE DES PRESTATAIRES
         * @returns Liste des prestataires
        */
    @Get("")
        @UserTypes(TypeUtilisateur.TempoOne)
        @ApiOperation({summary: "Lister les prestataires"})
        @ApiOkResponse({description: "Ok", type: [PrestataireSwaggerDto]})
    findAllPrestataires() {
        return this.prestataireService.findAll();
    }

        /**
         * LISTE DES PRESTATAIRES FILTRE PAR Nom, Prenom et Nom d'Entreprise
         * @param nom 
         * @param prenom 
         * @param nomEntreprise 
         * @returns Liste des prestataires filtrés
        */
    @Get('/filterBy')
        @UserTypes(TypeUtilisateur.TempoOne)
        @ApiOperation({summary: "Filtré les prestataires par nom de l'entreprise"})
        @ApiOkResponse({description: "Ok", type: [PrestataireSwaggerDto]})
        filterPrestataireUsersBy(
            //@Query('nom') nom?:string, 
            //@Query('prenom') prenom?:string,
            @Query('nomEntreprise') nomEntreprise?:string
        ): Promise<Prestataire[]> {
            return this.prestataireService.filterBy(undefined, undefined, nomEntreprise);
        }
        
        /**
         * MODIFICATION D'UN PRESTATAIRE
         * @param id ID du prestataire
         * @param data Prestataire avec les nouvelles données
         * @returns Prestataire modifié
        */
    @Put("/:id")
        @UserTypes(TypeUtilisateur.TempoOne)
        @ApiBody({type: PrestataireUpdateDto})
        @ApiOperation({summary: "Modifié un prestataire"})
        @ApiCreatedResponse({description: "Prestataire modifié avec succés", type: PrestataireSwaggerDto})
        @ApiBadRequestResponse({description: "Données invalides, Réessayé"})
    updatePrestataire(@Param("id", ParseIntPipe) id: number, @Body() data: PrestataireUpdateDto){
        return this.prestataireService.update(id, data)
    }


        /**
         * DESACTIVER UN COMPTE PRESTATAIRE
         * @param id ID du prestataire
         * @returns MESSAGE de confirmation
         */
    @Delete("/:id")
        @UserTypes(TypeUtilisateur.TempoOne)
        @ApiParam({name: "id", description: "L'ID du prestataire qu'on veut désactivé le compte."})
        @ApiOperation({summary: "Désactivé le compte d'un prestataire donné."})
        @ApiCreatedResponse({description: "Compte desactivé avec succés!", type: "Compte prestataire désactivé"})
        @ApiNotFoundResponse({description: "Prestataire Introuvable"})
    desactivatePrestataireAccount(@Param('id') id:number) {
        return this.prestataireService.desactivate(id);
    }

        /**
         * ACTIVATION COMPTE PRESTATAIRE
         * @param id ID du prestataire
         * @returns MESSAGE de confirmation
        */
    @Put("/:id/activate")
        @UserTypes(TypeUtilisateur.TempoOne)
        @ApiParam({name: "id", description: "L'ID du prestataire qu'on veut activé le compte."})
        @ApiOperation({summary: "Activé le compte d'un prestataire donné."})
        @ApiCreatedResponse({description: "Compte desactivé avec succés!", type: "Compte prestataire activé"})
        @ApiNotFoundResponse({description: "Prestataire Introuvable"})
    activatePrestataireAccount(@Param('id') id:number){
        return this.prestataireService.activate(id);
    }

    /**
     * DETAILS D'UN PRESTATAIRE
     * @param id ID du prestataire
     * @returns  Prestataire
    */
   @Get("/:id")
        @UserTypes(TypeUtilisateur.TempoOne, TypeUtilisateur.Prestataire)
        @Roles(UserRole.ResponsableExploitation, UserRole.Admin)
        @ApiParam({name: "id", description: "L'ID prestataire"})
        @ApiOperation({summary: "Voir les informations concernant le prestataire"})
        @ApiOkResponse({description: "Ok", type: [PrestataireSwaggerDto]})
        @ApiNotFoundResponse({description: "Prestataire Introuvable"})
    findById(@Param("id") id:number) {
        return this.prestataireService.findById(id);
    }   
    /* ---- ---- ---- --- --- -- */


    /* LIVREUR */
    /**
     * LISTE DES LIVREURS D'UN PRESTATAIRE
     * @param id_prestataire id du prestataire
     * @returns Liste des livreurs d'un prestataire
     */
    @Get("/:id/livreurs")
    @Roles(UserRole.Admin, UserRole.ResponsableExploitation)
        @ApiParam({name: "id", description: "L'ID du prestataire"})
        @ApiOperation({summary: "Voir les Livreurs du prestataire"})
        @ApiOkResponse({description: "Ok", type: [LivreurSwaggerDto]})
        @ApiNotFoundResponse({description: "Prestataire Introuvable"})
    findLivreurByIdPrestataire(@Param("id", ParseIntPipe) id_prestataire: number){
        return this.livreurService.findAllLivreursByPrestataire(id_prestataire);
    }

    /**
     * CREATION D'UN LIVREUR
     * @param id ID du prestataire
     * @param data Données du livreur et de l'utilisateur
     * @description Crée un utilisateur de type livreur
     * @returns Livreur
     */
    @Post("/:id/livreurs")
        @ApiBody({type: CreateLivreurDto})
        @ApiOperation({summary: "Créer un utilisateur de type livreur"})
        @ApiCreatedResponse({description: "Livreur crée avec succés!", type: LivreurSwaggerDto})
        @ApiBadRequestResponse({description: "Données invalides"})
    createLivreur(@Param("id", ParseIntPipe) id: number, @Body() data: CreateLivreurDto){
        return this.livreurService.create(id, data);
    }

    // /**
    //  * DESACTIVER UN LIVREUR
    //  * @param id_prestataire ID du prestataire
    //  * @param idLivreur ID du livreur à désactiver 
    //  * @returns Message de succès
    //  */
    // @Delete("/:idPrestataire/livreurs/:idLivreur/desactivate")
    // @ApiOperation({summary: "Désactiver le compte d'un livreur!"})
    // @ApiCreatedResponse({description: "Compte désactivé!", type: "string"})
    // @ApiNotFoundResponse({description: "Prestataire ou Livreur Introuvable"})
    // @ApiInternalServerErrorResponse({description: "Internal server error"})
    // desactivateLivreur(@Param("idPrestataire") id_prestataire: number, @Param("idLivreur") idLivreur: number): Promise<{message: string}>{
    //     return this.livreurService.changeAccountStatus(id_prestataire, idLivreur, false);
    // }

    // /**
    //  * ACTIVER UN LIVREUR
    //  * @param id_prestataire ID du prestataire
    //  * @param idLivreur ID du livreur à activer 
    //  * @returns Message de succès
    //  */
    // @Put("/:idPrestataire/livreurs/:idLivreur/activate")
    //     @ApiParam({name: "idPrestataire", description: "ID du prestataire"})
    //     @ApiParam({name: "idLivreur", description: "ID du livreur"})
    //     @ApiOperation({summary: "Activer le compte d'un livreur!"})
    //     @ApiCreatedResponse({description: "Compte activé!", type: "string"})
    //     @ApiNotFoundResponse({description: "Prestataire ou Livreur Introuvable"})
    // activateLivreur(@Param("idPrestataire") id_prestataire: number, @Param("idLivreur") idLivreur: number){
    //     return this.livreurService.changeAccountStatus(id_prestataire, idLivreur, true);
    // }

    /**
     * ACTIVER OU DESACTIVER LA FONCTIONNALITE DE SCAN AU MOMENT DU CHARGEMENT DU CAMION
     * @param id_prestataire ID du prestataire
     * @param idLivreur ID du livreur à activer ou désactiver la fonctionnalité
     * @param canScan true pour activer, false pour désactiver
     * @returns Message de succès
     */
    @Put("/:idPrestataire/livreurs/:idLivreur")
        @ApiParam({name: "idPrestataire", description: "ID du prestataire"})
        @ApiParam({name: "idLivreur", description: "ID du livreur"})
        @ApiOperation({summary: "Activer ou désactiver la fonctionnalité de scan au moment du chargement du camion"})
        @ApiNotFoundResponse({description: "Prestataire ou Livreur Introuvable"})
    changeScanLoadingTruckStatus(
        @Param("idPrestataire") id_prestataire: number,
        @Param("idLivreur") idLivreur: number, 
        @Query("canScan", ParseBoolPipe) canScan: boolean
    )
    {
        return this.livreurService.canScan(id_prestataire, idLivreur, canScan);
    }
    /* ---- ---- ---- --- --- -- */

    /* ===== RESPONSABLE EXPLOITATION ===== */
    /**
     * LISTER LES UTILISATEURS RESPONSABLES EXPLOITATION D'UN PRESTATAIRE
     * @param id_prestataire ID du prestataire
     * @returns Liste des utilisateurs responsables exploitation d'un prestataire
     */
    @Get("/:id/responsable-exploitation")
    @ApiParam({name: "id", description: "L'ID du prestataire"})
    @ApiOperation({summary: "Lister les utilisateurs de type Responsable Exploitation d'un prestataire"})
    @ApiOkResponse({description: "Ok", type: [UserSwaggerDto]})
    @ApiNotFoundResponse({description: "Prestataire Introuvable"})
    @ApiInternalServerErrorResponse({description: "Internal server error"})
    findResponsableExploitationByIdPrestataire(@Param("id") id_prestataire: number){
        return this.prestataireService.findReponsableExploitation(id_prestataire);
    }
    /* ---- ---- ---- --- --- -- */



    /* ===== POINT DE LIVRAISON ====== */
    /**
     * RATTACHER DES POINTS DE LIVRAISON A UN PRESTATAIRE
     * @param id ID du prestataire
     * @param pointsLivraison ID des points de livraison à rattacher
     * @returns Message de succès
     */
    @Post("/:id/points-livraison")
    @Roles(UserRole.Admin)
        @ApiParam({name: "id", description: "ID du prestataire"})
        @ApiBody({type: [Number], description: "Les id des points de livraison"})
        @ApiOperation({summary: "Rattacher des points de livraison à un prestataire"})
        @ApiCreatedResponse({description: "Attaché avec succés!", type: String})
        @ApiBadRequestResponse({description: "Données invalides"})
    async assignDeliveryPointsToProvider(@Param("id") id: number, @Body() pointsLivraison: number[] ){
        const prestataire = await this.prestataireService.findById(id);

        if(!prestataire) throw new BadRequestException(`Prestataire avec id:${id} Introuvable`);
        return this.plService.assignDeliveryPointsToProvider(prestataire, pointsLivraison);
    }


    /**
     * LISTE DES POINTS DE LIVRAISON RATTACHE A UN PRESTATAIRE
     * @param id ID du prestataire
     * @returns Liste des points de livraison rattaché à un prestataire
     */
    @Get("/:id/points-livraison")
    @Roles(UserRole.Admin, UserRole.ResponsableExploitation)
        @ApiParam({name: "id", description: "ID du prestataire"})
        @ApiOperation({summary: "Lister les points de livraison rattachés à un prestataire"})
        @ApiOkResponse({description: "Ok", type: [PointLivraisonSwaggerDto]})
        @ApiNotFoundResponse({description: "Prestataire Introuvable"})
    async getProviderDeliveryPoints(@Param("id") id: number){
        return this.plService.findByPrestataire(id);
    }


    /* +++++ +++ ORDRE DE LIVRAISON +++ +++++ */
    @Get("/:idPrestataire/ordres-livraison/historique")
        @ApiTags("Ordre de Livraison")
        @ApiOperation({ 
            description: `Liste des historiques d'ordres de livraison déja effectué ou en cours. 
            Peut etre filtré par idClient, Date de livraison, code postal ou ville`
        })
    async getOrdreLivraison(@Param("id") idPrestataire:string, 
        @Query("idClient") idClient: string|undefined,
        @Query("dateLivraison") dateLivraison: string|undefined,   
        @Query("zoneGeographique") zoneGeographique: string|undefined, 
    )   
    {
        if(!idPrestataire) throw new BadRequestException("ID Prestataire est obligatoir.");

        return this.ordreLivraisonService.filterBy(idPrestataire, idClient, dateLivraison, zoneGeographique);
    }

    
    /* +++++ +++ NOTIFICATION +++ +++++ */
    @Get("/:idPrestataire/notifications")
        @ApiTags("Notification")
        @ApiOperation({ 
            description: `Liste des notifications du prestataire.`
        })
    async getNotification(@Param("id", ParseIntPipe) idPrestataire:number)   
    {
        if(!idPrestataire) throw new BadRequestException("ID Prestataire est obligatoir.");

        return this.notificationService.findPrestataireNotications(idPrestataire);
    }

}
