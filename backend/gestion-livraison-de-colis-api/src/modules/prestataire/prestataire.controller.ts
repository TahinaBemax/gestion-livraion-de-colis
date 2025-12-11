import { TourneeLivraisonService } from 'src/modules/tournee-livraison/tournee-livraison.service';
import { TourneeLivraisonCreateDto } from 'src/common/dto/tournee-livraison/create-tournee-livraison-dto';
import { BadRequestException, Body, Controller, Delete, Get, Param, ParseBoolPipe, ParseIntPipe, Post, Put, Query, UseGuards} from '@nestjs/common';
import { PrestataireService } from './prestataire.service';
import { CreateLivreurDto } from 'src/common/dto/livreur/create-livreur-dto';
import { LivreurService } from '../livreur/livreur.service';
import { UserRole } from 'src/common/enum/user-role.enum';
import { Roles, UserTypes } from 'src/common/decorators/roles.decorator';
import { PointLivraisonService } from '../point-livraison/point-livraison.service';
import { ApiBadRequestResponse, ApiBody, ApiCreatedResponse, ApiInternalServerErrorResponse, ApiNotFoundResponse, ApiOkResponse, ApiOperation, ApiParam, ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';
import { PrestataireSwaggerDto } from 'src/common/swagger-dto/prestataire/prestataire-swagger-dto';
import { LivreurSwaggerDto } from 'src/common/swagger-dto/livreur/livreur-swagger-dto';
import { UserSwaggerDto } from 'src/common/swagger-dto/user/user-swagger-dto';
import { PointLivraisonSwaggerDto } from 'src/common/swagger-dto/point-livraison/point-livraison-swagger-dto';
import { CreateUserDto } from 'src/common/dto/create-user-dto';
import { User } from '../user/user.entity';
import { UserService } from '../user/user.service';
import { TypeUtilisateur } from 'src/common/enum/type-utilisateur.enum';
import { OrdreLivraisonService } from '../ordre-livraison/ordre-livraison.service';
import { NotificationService } from '../notification/notification.service';
import { PrestataireCreateDto } from 'src/common/dto/prestataire/create-prestataire-dto';
import { PrestataireUpdateDto } from 'src/common/dto/prestataire/update-prestataire-dto';
import { Prestataire } from './prestataire.entity';
import { Livreur } from '../livreur/livreur.entity';
import { SamePrestataireGuard } from 'src/common/guards/same-prestataire.guard';
import { OrdreLivraisonCreateDto } from 'src/common/dto/ordre-livraison/ordre-livraison-create-dto';
import { OrdreLivraisonDto } from 'src/common/dto/ordre-livraison/ordre-livraison-dto';
import { LivraisonsService } from '../livraisons/livraisons.service';


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
        private readonly tourneeService: TourneeLivraisonService,
        private readonly livraisonService: LivraisonsService,
    ){}

    /* UTILISATEUR PRESTATAIRE */

    /**
     * Creation d'un utilisateur prestataire
     * @param id ID du prestataire
     * @param dto 
     * @returns User
     */
    @Post("/:idPrestataire/users")
    @UseGuards(SamePrestataireGuard)
        @ApiBody({type: CreateUserDto})
        @ApiOperation({summary: "Creation d'un utilisateur prestataire"})
        @ApiCreatedResponse({type: UserSwaggerDto, description: "Utilisateur a été crée avec succés!"})
        @ApiBadRequestResponse({description: "Données invalides"})
    createUser(@Param("id", ParseIntPipe) id: number, @Body() dto: CreateUserDto): Promise<User> {
        return this.userService.savePrestataireUser(id, dto);
    }    
  

        /**
         * LISTE DES UTILISATEURS PRESTATAIRE ACTIVES FILTRE PAR PRENOM, NOM, ROLE ET ENTREPRISE
         * @param nom 
         * @param prenom 
         * @param role 
         * @param nomEntreprise 
         * @returns Liste des utilisateurs filtrés
         */
    @Get('/users')
        @Roles(UserRole.Admin, UserRole.ResponsableExploitation)
        @UserTypes(TypeUtilisateur.Prestataire, TypeUtilisateur.TempoOne)
        @ApiQuery({name: "req", required: false, description: "utilisé pour faire une filtre", example: "filtre"})
        @ApiQuery({name: "nom", required: false})
        @ApiQuery({name: "prenom", required: false})
        @ApiQuery({name: "role", required: false})
        @ApiQuery({name: "nomEntreprise", required: false})
        @ApiOperation({summary: "Liste des utilisateurs des Prestataires, ils peuvent être filtré par prénom, nom, rôle et le nom de l'entreprise"})
        @ApiOkResponse({description: "Ok", type: [UserSwaggerDto]})
    filterBy
    (
        @Query('nom') nom?:string, 
        @Query('req') req?:string, 
        @Query('prenom') prenom?:string, 
        @Query('role') role?:string, 
        @Query('nomEntreprise') nomEntreprise?:string
    ): Promise<User[]> {
        if(!req) return this.userService.findPrestataireUsers();
        if(req && req === "filtre"){
            return this.userService.filterBy(nom, prenom, role, nomEntreprise);
        }
        throw new BadRequestException("Paramètre 'req' invalide, Réessayé");
    }

    /**
     * LISTER LES UTILISATEURS D'UN PRESTATAIRE, et peut être filtré par ID Prestataire, nom, prenom, role
     * @param id ID du prestataire
     * @param nom Filtrer par nom
     * @param prenom Filtrer par prénom
     * @param role Filtrer par rôle
     * @returns Liste des utilisateurs prestataires
     */   
    @Get("/:idPrestataire/users")
    @Roles(UserRole.Admin, UserRole.ResponsableExploitation)
    @UseGuards(SamePrestataireGuard)
        @ApiOperation({summary: "Lister les utilisateurs actives d'un specifique prestataire et peut être filtré par nom, prenom, role"})
        @ApiOkResponse({description: "Ok", type: [UserSwaggerDto]})
        @ApiInternalServerErrorResponse({description: "Internal server error"})
    findAllUsers(@Param("idPrestataire", ParseIntPipe) id: number, @Query('nom') nom?:string, @Query('prenom') prenom?:string, @Query('role') role?:string): Promise<User[]> {
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
        @ApiQuery({name: "req", required: false, description: "utilisé pour faire une filtre", example: "filtre"})
        @ApiOkResponse({description: "Ok", type: [PrestataireSwaggerDto]})
        @ApiQuery({name: "nomEntreprise", required: false})
    findAllPrestataires(@Query('req') req?:string, @Query('nomEntreprise') nomEntreprise?:string): Promise<Prestataire[]> {
        if(req && req === "filtre"){
            return this.prestataireService.filterBy(undefined, undefined, nomEntreprise);
        } else if(!req){
            return this.prestataireService.findAll();
        }
        throw new BadRequestException("Paramètre 'req' invalide, Réessayé");
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
        @ApiQuery({
            name: "req", required: false, 
            description: "utilisé pour activer le compte d'un prestataire", 
            example: "active-account"
        })
    updatePrestataire(@Param("id", ParseIntPipe) id: number, @Body() data?: PrestataireUpdateDto, @Query('req') req?:string){
        if(req && req === "active-account"){
            return this.prestataireService.activate(id);
        } 
        else if(!req && data){
            return this.prestataireService.update(id, data)
        }
        else if(!data) throw new BadRequestException("Données invalides, Réessayé");
        throw new BadRequestException("Paramètre 'req' invalide, Réessayé");

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
         * Lister les livreurs qui ont déjà scanné un bordereau et qui ont une tournée aujourd'hui
         * @param id ID du livreur
         * @returns Livreur
        */
    @Get("/:idPrestataire/livreurs/en-trajet")
    @Roles(UserRole.ResponsableExploitation, UserRole.User, UserRole.Admin)
    @UserTypes(TypeUtilisateur.Prestataire, TypeUtilisateur.TempoOne)
    @UseGuards(SamePrestataireGuard)
        @ApiOperation({summary: "Lister les livreurs qui ont déjà scanné un bordereau et qui ont une tournée aujourd'hui"})
    async getLivreurEncoursLivraison(@Param("idPrestataire", ParseIntPipe) id_prestataire: number): Promise<Livreur[]>{
        return this.livreurService.findLivreurEncoursLivraison(id_prestataire);
    }

    /**
     * CREATION D'UN LIVREUR
     * @param id ID du prestataire
     * @param data Données du livreur et de l'utilisateur
     * @description Crée un utilisateur de type livreur
     * @returns Livreur
     */
    @Post("/:idPrestataire/livreurs")
    @UseGuards(SamePrestataireGuard)
        @ApiBody({type: CreateLivreurDto})
        @ApiOperation({summary: "Créer un utilisateur de type livreur"})
        @ApiCreatedResponse({description: "Livreur crée avec succés!", type: LivreurSwaggerDto})
        @ApiBadRequestResponse({description: "Données invalides"})
    createLivreur(@Param("id", ParseIntPipe) id: number, @Body() data: CreateLivreurDto){
        return this.livreurService.create(id, data);
    }


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
    // @Get("/:id/responsable-exploitation")
    // @UseGuards(SamePrestataireGuard)
    //     @ApiParam({name: "id", description: "L'ID du prestataire"})
    //     @ApiOperation({summary: "Lister les utilisateurs de type Responsable Exploitation d'un prestataire"})
    //     @ApiOkResponse({description: "Ok", type: [UserSwaggerDto]})
    //     @ApiNotFoundResponse({description: "Prestataire Introuvable"})
    // findResponsableExploitationByIdPrestataire(@Param("id") id_prestataire: number){
    //     return this.prestataireService.findReponsableExploitation(id_prestataire);
    // }
    /* ---- ---- ---- --- --- -- */



    /* ===== POINT DE LIVRAISON ====== */
    /**
     * RATTACHER DES POINTS DE LIVRAISON A UN PRESTATAIRE
     * @param id ID du prestataire
     * @param pointsLivraison ID des points de livraison à rattacher
     * @returns Message de succès
     */
    @Post("/:id/points-livraison")
    @UserTypes(TypeUtilisateur.TempoOne)
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
    @UserTypes(TypeUtilisateur.TempoOne, TypeUtilisateur.Prestataire)
    @Roles(UserRole.Admin, UserRole.ResponsableExploitation)
        @ApiParam({name: "id", description: "ID du prestataire"})
        @ApiOperation({summary: "Lister les points de livraison rattachés à un prestataire"})
        @ApiOkResponse({description: "Ok", type: [PointLivraisonSwaggerDto]})
        @ApiNotFoundResponse({description: "Prestataire Introuvable"})
    async getProviderDeliveryPoints(@Param("id") id: number){
        return this.plService.findByPrestataire(id);
    }


    /* +++++ +++ TOURNEE DE LIVRAISON +++ +++++ */
    @Post("/:idPrestataire/tournees")
    @UseGuards(SamePrestataireGuard)
    @ApiTags("Tournée de livraison")
        @ApiOperation({ summary: 'Créer un tournée'})
        @ApiBody({type: [TourneeLivraisonCreateDto]})
    async saveTourneeLivraison(@Param("idPrestataire") idPrestataire:number, @Body() data: TourneeLivraisonCreateDto[])   
    {
        if(!idPrestataire) throw new BadRequestException("ID Prestataire est obligatoir.");

        return this.tourneeService.batchSave(idPrestataire, data);
    }


    @Get("/:idPrestataire/tournees")
    @UseGuards(SamePrestataireGuard)
    @ApiTags("Tournée de livraison")
        @ApiOperation({ summary: 'Liste des tournées de livraison d\'un prestataire'})
        @ApiBody({type: [TourneeLivraisonCreateDto]})
    async findAllTournee(@Param("idPrestataire") idPrestataire:number)   
    {
        if(!idPrestataire) throw new BadRequestException("ID Prestataire est obligatoir.");

        return this.tourneeService.findAllByIDPrestataire(idPrestataire);
    }

        /**
         * CREATION D'UN OU PLUSIEURS ORDRES DE LIVRAISON
         * @param id Identifiant de la tournée de livraison
         * @param dto Données des points de livraison
         * @returns Ordres de livraison enregistrés
         */
    @Post("/:idPrestataire/tournees/:id/ordres-livraison")
        @UseGuards(SamePrestataireGuard)
        @ApiOperation({ summary: 'Créer un ordre livraison' })
        @ApiBody({type: OrdreLivraisonCreateDto})
        @ApiTags("Ordre de Livraison")
    async saveOrdreLivraison(@Param("id", ParseIntPipe) id: number, @Body() dto: OrdreLivraisonCreateDto){
        const mapped: OrdreLivraisonDto[] = await this.ordreLivraisonService.mapToOrdreLivraisonCreateDTo(id, dto);
        return this.ordreLivraisonService.batchSave(mapped);
    }

    /* +++++ +++ ORDRE DE LIVRAISON +++ +++++ */
    /**
     * Liste des livraisons en attente pour un prestataire
     * @param idPrestataire ID du prestataire
     * @returns Liste des livraisons en attente
     */
    @Get("/:idPrestataire/livraisons/en-attente")
    @UseGuards(SamePrestataireGuard)
        @ApiTags("Livraison")
        @ApiOperation({ 
            summary: "Liste des Livraisons d'un prestataire",
        })
        @ApiParam({name: "idPrestataire", description: "", required: true})
    async getPrestataireLivraisons(@Param("idPrestataire") idPrestataire:number)   
    {
        if(!idPrestataire) throw new BadRequestException("ID Prestataire est obligatoire.");

        return this.livraisonService.findPendingDeliveries(idPrestataire);
    }


    
    @Get("/:idPrestataire/ordres-livraison/historique")
    @UseGuards(SamePrestataireGuard)
    @ApiTags("Ordre de Livraison")
        @ApiOperation({ summary: 'Historique des livraisons',
             description: ` Lister les ordres de livraison déjà effectués et en cours de traitement et puet être filtré, par prestataire, par zone géographique, par client, par date` 
            })
        @ApiParam({name: "idPrestataire", description: "", required: true})
        @ApiQuery({name: "idClient", description: "", required: false})
        @ApiQuery({name: "dateTournee", description: "La date du tournéé", required: false})
        @ApiQuery({name: "zoneGeographique", description: "code postal ou ville", required: false})
    async getOrdreLivraison(@Param("idPrestataire") idPrestataire:string, 
        @Query("idClient") idClient: string|undefined,
        @Query("dateTournee") dateLivraison: string|undefined,   
        @Query("zoneGeographique") zoneGeographique: string|undefined, 
    )   
    {
        if(!idPrestataire) throw new BadRequestException("ID Prestataire est obligatoir.");

        return this.ordreLivraisonService.filterBy(idPrestataire, idClient, dateLivraison, zoneGeographique);
    }

    
    /* +++++ +++ NOTIFICATION +++ +++++ */
    @Get("/:idPrestataire/notifications")
    @UseGuards(SamePrestataireGuard)
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
