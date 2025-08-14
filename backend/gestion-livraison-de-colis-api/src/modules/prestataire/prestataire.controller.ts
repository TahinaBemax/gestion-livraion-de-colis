import { BadRequestException, Body, Controller, Get, Param, ParseBoolPipe, Post, Put, Query} from '@nestjs/common';
import { PrestataireService } from './prestataire.service';
import { CreateLivreurDto } from 'src/common/dto/livreur/create-livreur-dto';
import { Livreur } from '../livreur/livreur.entity';
import { LivreurService } from '../livreur/livreur.service';
import { UserRole } from 'src/common/enum/user-role.enum';
import { Roles } from 'src/common/decorators/roles.decorator';
import { PointLivraisonService } from '../point-livraison/point-livraison.service';
import { ApiBadRequestResponse, ApiBody, ApiCreatedResponse, ApiInternalServerErrorResponse, ApiNotFoundResponse, ApiOkResponse, ApiOperation, ApiParam, ApiTags } from '@nestjs/swagger';
import { PrestataireSwaggerDto } from 'src/common/swagger-dto/prestataire/prestataire-swagger-dto';
import { LivreurSwaggerDto } from 'src/common/swagger-dto/livreur/livreur-swagger-dto';
import { UserSwaggerDto } from 'src/common/swagger-dto/user/user-swagger-dto';
import { PointLivraisonSwaggerDto } from 'src/common/swagger-dto/point-livraison/point-livraison-swagger-dto';


@Controller('prestataires')
@ApiTags('prestataires')
@Roles(UserRole.ResponsableExploitation)
export class PrestataireController {
    constructor(
        private readonly prestataireService: PrestataireService,
        private readonly livreurService: LivreurService,
        private readonly plService: PointLivraisonService,
    ){}

    @Get("/:id/profile")
    @Roles(UserRole.ResponsableExploitation, UserRole.Admin)
    @ApiParam({name: "id", description: "L'ID prestataire"})
    @ApiOperation({summary: "Voir les informations concernant le prestataire"})
    @ApiOkResponse({description: "Ok", type: [PrestataireSwaggerDto]})
    @ApiNotFoundResponse({description: "Prestataire Introuvable"})
    @ApiInternalServerErrorResponse({description: "Internal server error"})
    findById(@Param("id") id:number) {
        return this.prestataireService.findById(id);
    }

    @Get("/:id/livreurs")
    @Roles(UserRole.Admin, UserRole.ResponsableExploitation)
    @ApiParam({name: "id", description: "L'ID du prestataire"})
    @ApiOperation({summary: "Voir les Livreurs du prestataire"})
    @ApiOkResponse({description: "Ok", type: [LivreurSwaggerDto]})
    @ApiNotFoundResponse({description: "Prestataire Introuvable"})
    @ApiInternalServerErrorResponse({description: "Internal server error"})
    findLivreurByIdPrestataire(@Param("id") id_prestataire: number){
        return this.livreurService.findAllLivreursByPrestataire(id_prestataire);
    }

    @Get("/:id/responsable-exploitation")
    @Roles(UserRole.Admin, UserRole.ResponsableExploitation)
    @ApiParam({name: "id", description: "L'ID du prestataire"})
    @ApiOperation({summary: "Voir les utilisateurs de type Responsable Exploitation du prestataire"})
    @ApiOkResponse({description: "Ok", type: [UserSwaggerDto]})
    @ApiNotFoundResponse({description: "Prestataire Introuvable"})
    @ApiInternalServerErrorResponse({description: "Internal server error"})
    findResponsableExploitationByIdPrestataire(@Param("id") id_prestataire: number){
        return this.prestataireService.findReponsableExploitation(id_prestataire);
    }

    @Post("/livreurs")
    @ApiBody({type: CreateLivreurDto})
    @ApiOperation({summary: "Crée un utilisateur de type livreur"})
    @ApiCreatedResponse({description: "Livreur crée avec succés!", type: LivreurSwaggerDto})
    @ApiBadRequestResponse({description: "Données invalides"})
    @ApiInternalServerErrorResponse({description: "Internal server error"})
    createLivreur(@Body() data: CreateLivreurDto){
        return this.livreurService.create(data);
    }

    @Put("/:id/livreurs")
    @ApiParam({name: "id", description: "ID du prestataire"})
    @ApiBody({type: LivreurSwaggerDto})
    @ApiOperation({summary: "Modifier un livreur"})
    @ApiCreatedResponse({description: "Livreur modifié avec succés!", type: LivreurSwaggerDto})
    @ApiBadRequestResponse({description: "Données invalides"})
    @ApiInternalServerErrorResponse({description: "Internal server error"})
    updateLivreur(@Param("id") id_prestataire: number, @Body() data: Livreur){
        return this.livreurService.update(id_prestataire, data);
    }

    @Put("/:idPrestataire/livreurs/:idLivreur/desactivate")
    @ApiOperation({summary: "Désactiver le compte d'un livreur!"})
    @ApiCreatedResponse({description: "Compte désactivé!", type: "string"})
    @ApiNotFoundResponse({description: "Prestataire ou Livreur Introuvable"})
    @ApiInternalServerErrorResponse({description: "Internal server error"})
    desactivateLivreur(@Param("idPrestataire") id_prestataire: number, @Param("idLivreur") idLivreur: number){
        return this.livreurService.changeAccountStatus(id_prestataire, idLivreur, false);
    }

    @Put("/:idPrestataire/livreurs/:idLivreur/activate")
    @ApiParam({name: "idPrestataire", description: "ID du prestataire"})
    @ApiParam({name: "idLivreur", description: "ID du livreur"})
    @ApiOperation({summary: "Activer le compte d'un livreur!"})
    @ApiCreatedResponse({description: "Compte activé!", type: "string"})
    @ApiNotFoundResponse({description: "Prestataire ou Livreur Introuvable"})
    @ApiInternalServerErrorResponse({description: "Internal server error"})
    activateLivreur(@Param("idPrestataire") id_prestataire: number, @Param("idLivreur") idLivreur: number){
        return this.livreurService.changeAccountStatus(id_prestataire, idLivreur, true);
    }

    @Put("/:idPrestataire/livreurs/:idLivreur")
    @ApiParam({name: "idPrestataire", description: "ID du prestataire"})
    @ApiParam({name: "idLivreur", description: "ID du livreur"})
    @ApiOperation({summary: "Activer ou désactiver la fonctionnalité de scan au moment du chargement du camion"})
    @ApiCreatedResponse({description: "Compte activé!", type: "string"})
    @ApiNotFoundResponse({description: "Prestataire ou Livreur Introuvable"})
    changeScanLoadingTruckStatus(@Param("idPrestataire") id_prestataire: number, @Param("idLivreur") idLivreur: number, @Query("canScan", ParseBoolPipe) canScan: boolean){
        return this.livreurService.canScan(id_prestataire, idLivreur, canScan);
    }

    /* POINT DE LIVRAISON */
    @Post("/:id/points-livraison")
    @Roles(UserRole.Admin)
    @ApiParam({name: "id", description: "ID du prestataire"})
    @ApiBody({type: [Number], description: "Les id des points de livraison"})
    @ApiOperation({summary: "Rattacher des points de livraison à un prestataire"})
    @ApiCreatedResponse({description: "Attaché avec succés!", type: String})
    @ApiBadRequestResponse({description: "Données invalides"})
    @ApiInternalServerErrorResponse({description: "Internal server error"})
    async assignDeliveryPointsToProvider(@Param("id") id: number, @Body() pointsLivraison: {ids: number[] } ){
        const prestataire = await this.prestataireService.findById(id);

        if(!prestataire) throw new BadRequestException(`Prestataire avec id:${id} Introuvable`);
        return this.plService.assignDeliveryPointsToProvider(prestataire, pointsLivraison.ids);
    }


    @Get("/:id/points-livraison")
    @Roles(UserRole.Admin, UserRole.ResponsableExploitation)
    @ApiParam({name: "id", description: "ID du prestataire"})
    @ApiOperation({summary: "Voir les points de livraison rattaché à un prestataire"})
    @ApiOkResponse({description: "Ok", type: [PointLivraisonSwaggerDto]})
    @ApiNotFoundResponse({description: "Prestataire Introuvable"})
    @ApiInternalServerErrorResponse({description: "Internal server error"})
    async getProviderDeliveryPoints(@Param("id") id: number){
        return this.plService.findByPrestataire(id);
    }
}
