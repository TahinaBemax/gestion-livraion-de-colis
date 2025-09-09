import { BadRequestException, Body, Controller, Get, HttpCode, HttpStatus, Param, ParseIntPipe, Post, Put, Query } from '@nestjs/common';
import { PointLivraisonService } from './point-livraison.service';
import { CreatePointLivraisonDto } from 'src/common/dto/point-livraison/point-livraison-create-dto';
import { Roles, UserTypes } from 'src/common/decorators/roles.decorator';
import { UserRole } from 'src/common/enum/user-role.enum';
import { ApiBadRequestResponse, ApiBody, ApiCreatedResponse, ApiOperation, ApiParam } from '@nestjs/swagger';
import { PointLivraisonEntity } from './point-livraison.entity';
import { TypeUtilisateur } from 'src/common/enum/type-utilisateur.enum';
import { ContrainteLivraisonDto } from 'src/common/dto/contrainte-livraison/contrainte-livraison-dto';
import { PointLivraisonUpdateDto } from 'src/common/dto/point-livraison/point-livraison-update-dto';

@Controller('points-livraison')
@Roles(UserRole.Admin)
export class PointLivraisonController {
    constructor(
        private readonly plService: PointLivraisonService
    ){}

    /* ++++ ++++ POINT DE LIVRAISON ++++ ++++ */
        /**
         * LISTE DES POINTS DE LIVRAISON
         * @returns Liste point de livraison
         */
    @Get()
        @UserTypes(TypeUtilisateur.TempoOne)
    findAll(){
            return this.plService.findAll();
        }
      
        /**
         * LISTE DES POINTS DE LIVRAISON FILTRE PAR VILLE ET NOM MAGASIN
         * @returns Liste point de livraison
        */    
    @Get("/filtre")
    @Roles(UserRole.Admin, UserRole.ResponsableExploitation)
    @UserTypes(TypeUtilisateur.TempoOne, TypeUtilisateur.Prestataire)
        @ApiOperation({description: "Filtré les points de livraison par ville et nom du magasin"})
        @ApiBadRequestResponse()
    getAllByCityAndNumeroMagasin(@Query("city") city:string, @Query("nomMagasin") numMagasin: string): Promise<PointLivraisonEntity[]>{
        return this.plService.findByCityNumeroMagasin(city, numMagasin);
    }
        
        
    @Get("/:id")
        @Roles(UserRole.Admin, UserRole.ResponsableExploitation, UserRole.User)
        @UserTypes(TypeUtilisateur.TempoOne, TypeUtilisateur.Prestataire, TypeUtilisateur.Livreur)
    findById(@Param("id") id: number){
        return this.plService.findById(id);
    }

    @Put("/:id")
        @UserTypes(TypeUtilisateur.TempoOne)
    update(@Param("id", ParseIntPipe) id: number, @Body() data: PointLivraisonUpdateDto){
        return this.plService.update(id, data);
    }
    
    @Post()
        @UserTypes(TypeUtilisateur.TempoOne)
        @HttpCode(HttpStatus.CREATED)
        @ApiBody({type: CreatePointLivraisonDto})
        @ApiCreatedResponse({type: PointLivraisonEntity})
        @ApiBadRequestResponse()
    create( @Body() data: CreatePointLivraisonDto){
        return this.plService.create(data);
    }

    /* ----- -------- --------- */
        

    /* ++++ ++++ CONTRAINTE DE LIVRAISON ++++ ++++ */
        /**
         * RATTACHER DES CONTRAINTES DE LIVRAISON SUR UN POINT DE LIVRAISON
         * @param id ID du point de livraison
         * @param constraintsLivraison Contraintes de livraison
         * @returns Liste des contraintes de livraison
         */
    @Post("/:id/contraintes-livraison")
    @UserTypes(TypeUtilisateur.TempoOne)
        @ApiParam({name: "id", description: "ID du point de livraison"})
        @ApiBody({type: [ContrainteLivraisonDto], description: "Les contraintes de livraison"})
        @ApiOperation({summary: "Rattacher des contraintes de livraison à un point de livraison"})
        @ApiCreatedResponse({description: "Contraintes de livraison rattachée avec succés!", type: String})
        @ApiBadRequestResponse({description: "Données invalides"})
    async assignDeliveryConstraintsToPL(@Param("id") id: number, @Body() dto: ContrainteLivraisonDto[] ){
        if(!dto || !id) throw new BadRequestException(`Données invalide`);
        return this.plService.assignDeliveryConstraintsToPL(id, dto);
    }


    /* ++++ ++++ CONTRAINTE EVENEMENTS SUR LA VILLE ++++ ++++ */
        /**
         * RATTACHER DES CONTRAINTES DE LIVRAISON SUR UN POINT DE LIVRAISON
         * @param id ID du point de livraison
         * @param constraintsLivraison Contraintes de livraison
         * @returns Liste des contraintes de livraison
         */
    @Post("/:id/events")
        @UserTypes(TypeUtilisateur.TempoOne)
        @ApiParam({name: "id", description: "ID du point de livraison"})
        @ApiBody({type: [Number], description: "Les ID des contraintes de livraison"})
        @ApiOperation({summary: "Rattacher des contraintes évenementielle sur un point de livraison"})
        @ApiBadRequestResponse({description: "Données invalides"})
    async assignEventsConstraintsToPL(@Param("id") id: number, @Body() evenementsID: number[] ){
        if(!evenementsID || !id) throw new BadRequestException(`Données invalide`);
        return this.plService.assignEventsConstraintToPL(id, evenementsID);
    }
}
