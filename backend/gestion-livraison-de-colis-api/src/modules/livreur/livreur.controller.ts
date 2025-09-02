import { Body, Controller, Delete, Get, HttpCode, HttpStatus, Param, ParseIntPipe, Post, Put, UseGuards } from '@nestjs/common';
import { ApiBadRequestResponse, ApiBody, ApiCreatedResponse, ApiNotFoundResponse, ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
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
import { ProblemeLivraisonCreateDto } from 'src/common/dto/livraison/create-probleme-livraison-dto';
import { LivraisonsService } from '../livraisons/livraisons.service';
import { NotificationService } from '../notification/notification.service';
import { SameUserGuard } from 'src/common/guards/same-user.guard';

@Controller('livreurs')
@Roles(UserRole.User, UserRole.ResponsableExploitation)
@UserTypes(TypeUtilisateur.Livreur, TypeUtilisateur.Prestataire)
@ApiTags("Livreur Temporaire")
export class LivreurController {
    constructor(
        private readonly livreurTempService: LivreurTemporaireService,
        private readonly livreurService: LivreurService,
        private readonly livraisonService: LivraisonsService,
        private readonly notifService: NotificationService,
    ){}

    /* LIVREUR */
    
        /**
         * LISTE DES LIVREURS
         * @returns Liste des livreurs
        */
   @Get("")
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
        @ApiOkResponse()
        @ApiNotFoundResponse()
    async getAllByDeliveryID(@Param("id", ParseIntPipe) id: number): Promise<LivreurTemporaireEntity[]>{
        return this.livreurTempService.findAllByDeliveryID(id);
    }
        /**
         * RECUPERER UN LIVREUR TEMPORAIRE PAR SON ID
         * @param id ID du livreur temporaire
         * @returns Livreur temporaire
         */
    @Get("/temporaire/:idTemp")
        @ApiOkResponse()
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
        @ApiBody({type: LivreurTemporaireDto})
        @ApiCreatedResponse()
        @ApiNotFoundResponse()
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
    @Put('/:id/temporaire/:idLivreurTemp')
    @UseGuards(SameUserGuard)
        @ApiBody({type: LivreurTemporaireUpdateDto})
        @ApiCreatedResponse()
        @ApiNotFoundResponse()
    async update(@Param("id", ParseIntPipe) id: number,@Param("idLivreurTemp", ParseIntPipe) idLivreurTemp:number, @Body() dto: LivreurTemporaireUpdateDto){
        return this.livreurTempService.update(id, idLivreurTemp, dto);
    }

        /**
         * DESACTIVATION D'UN LIVREUR TEMPORAIRE
         * @param id ID du livreur temporaire à désactiver
         * @returns MESSAGE de succès
         */
    @Delete('/temporaire/:id')
        @ApiBody({type: LivreurTemporaireUpdateDto})
        @ApiOkResponse()
        @ApiNotFoundResponse()
    async desactivateAccount(@Param("id", ParseIntPipe) id: number){
        return this.livreurTempService.delete(id);
    }

    /* ===== LIVRAISON ====== */
    @Post("/:id/livraisons/:idLivraison/problemes")
    @UseGuards(SameUserGuard)
    @HttpCode(HttpStatus.CREATED)
    @ApiBody({type: ProblemeLivraisonCreateDto})
        @ApiCreatedResponse()
        @ApiBadRequestResponse()
        @ApiNotFoundResponse()
    async signalProbleme(@Param("id", ParseIntPipe) idLivraison: number, @Body() dto: ProblemeLivraisonCreateDto){
        return this.livraisonService.signalProbleme(idLivraison, dto);
    }

    /* ===== NOTIFICATION ====== */
    @Get("/:id/notifications")
        /**
         * @param id ID du livreur
         * LISTE DES NOTIFICATION D'UN LIVREUR
         * @returns Liste Notifications
         */
    @UseGuards(SameUserGuard)
    async getNotifications(@Param("id", ParseIntPipe) id: number){
        return this.notifService.findLivreurNotifications(id);
    }
}
