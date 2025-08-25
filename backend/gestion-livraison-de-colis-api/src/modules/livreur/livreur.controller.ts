import { Body, Controller, Delete, Get, Param, ParseIntPipe, Post, Put } from '@nestjs/common';
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

@Controller('livreurs')
@Roles(UserRole.User)
@UserTypes(TypeUtilisateur.Livreur, TypeUtilisateur.Prestataire)
@ApiTags("Livreur Temporaire")
export class LivreurController {
    constructor(
        private readonly livreurTempService: LivreurTemporaireService,
        private readonly livreurService: LivreurService,
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
    findLivreurs(){
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
        @Roles(UserRole.Admin, UserRole.User)
        @ApiBody({type: LivreurUpdateDto})
        @ApiOperation({summary: "modification d'un livreur"})
        @ApiCreatedResponse({description: "Livreur modifié avec succés!", type: LivreurSwaggerDto})
        @ApiBadRequestResponse({description: "Données invalides"})
    updateLivreur(@Param("id") idLivreur: number, @Body() data: LivreurUpdateDto): Promise<Livreur>{
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
        @ApiOkResponse()
        @ApiNotFoundResponse()
    getAllByDeliveryID(@Param("id", ParseIntPipe) id: number): Promise<LivreurTemporaireEntity[]>{
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
    getByIdTemporaryDeliveryID(@Param("id", ParseIntPipe) id: number){
        return this.livreurTempService.findById(id);
    }

    /**
     * CREATION D'UN LIVREUR TEMPORAIRE
     * @param id ID du livreur parent
     * @param dto Données du livreur temporaire
     * @returns Livreur temporaire créé
     */
    @Post('/:id/temporaire')
        @ApiBody({type: LivreurTemporaireDto})
        @ApiCreatedResponse()
        @ApiNotFoundResponse()
    save(@Param("id", ParseIntPipe) id: number, @Body() dto: LivreurTemporaireDto): Promise<LivreurTemporaireEntity>{
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
        @ApiBody({type: LivreurTemporaireUpdateDto})
        @ApiCreatedResponse()
        @ApiNotFoundResponse()
    update(@Param("id", ParseIntPipe) id: number,@Param("idLivreurTemp", ParseIntPipe) idLivreurTemp:number, @Body() dto: LivreurTemporaireUpdateDto){
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
    desactivateAccount(@Param("id", ParseIntPipe) id: number){
        return this.livreurTempService.delete(id);
    }
}
