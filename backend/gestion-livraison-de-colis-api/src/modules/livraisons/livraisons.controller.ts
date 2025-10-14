import { BadRequestException, Body, Controller, Get, HttpCode, HttpStatus, Param, ParseIntPipe, Post, Put, Query } from '@nestjs/common';
import { LivraisonsService } from './livraisons.service';
import { LivraisonCreateDto } from 'src/common/dto/livraison/create-livraison-dto';
import { ApiBadRequestResponse, ApiBody, ApiCreatedResponse, ApiOperation, ApiQuery, ApiTags } from '@nestjs/swagger';
import { Roles, UserTypes } from 'src/common/decorators/roles.decorator';
import { UserRole } from 'src/common/enum/user-role.enum';
import { LivraisonUpdateDto } from 'src/common/dto/livraison/update-livraison-dto';
import { LivraisonEntity } from './livraison.entity';
import { StatusLivraison } from 'src/common/enum/status-livraison.enum';
import { TypeUtilisateur } from 'src/common/enum/type-utilisateur.enum';
import { ColisService } from '../colis/colis.service';
import { ColisCreateDto } from 'src/common/dto/colis/create-colis-dto';

@Controller('livraisons')
@ApiTags("Livraison")
@Roles(UserRole.Admin)
@UserTypes(TypeUtilisateur.TempoOne)
export class LivraisonsController {
    constructor(
        private readonly livraisonService: LivraisonsService,
        private readonly colisService: ColisService
    ){}
    /**
     * LISTE DES LIVRAISONS
     * @returns Liste des livraisons
     */
    @Get()
    @ApiOperation({summary: "Lister les livraisons. Voir description", description: "Liste de toutes les livraisons, possibilité de faire une requette spécifique"})
    @ApiQuery({
        name: "req", required: false,
        example: "'', historique, filtre", 
        description: "Permet de faire une requette spécifique(liste des livraisons encours et livrées, filtre par prestataire, client, date de livraison et zone géographique(code postal ou ville)"
    })
    @ApiQuery({name: "idPrestataire", required: false})
    @ApiQuery({name: "idClient", required: false})
    @ApiQuery({name: "dateLivraison", required: false})
    @ApiQuery({name: "zoneGeographique", required: false})
    async getAll(
        @Query("req") query?: String,
        @Query("idPrestataire") idPrestataire?: string|undefined, 
        @Query("idClient") idClient?: string|undefined,
        @Query("dateLivraison") dateLivraison?: string|undefined,
        @Query("zoneGeographique") zoneGeographique?: string|undefined,
    ): Promise<LivraisonEntity[]>{
        if(!query){
            return this.livraisonService.findAll();
        }

        if(query && query === "historique"){
            const statuts: StatusLivraison[] = [
                StatusLivraison.LIVRE, 
                StatusLivraison.DISTRIBUEUR_ASSIGNÉ, 
                StatusLivraison.EN_COURS_LIVRAISON, 
                StatusLivraison.EN_EXPEDIE, 
                StatusLivraison.EN_TRANSIT, 
            ];
            return this.livraisonService.findByStatuts(statuts);
        } 
        else if(query && query === "filtre"){
            return this.livraisonService.filterBy(idPrestataire, idClient, dateLivraison, zoneGeographique);
        }
        else if(query && query === "incomplete"){
            if(!idClient) throw new BadRequestException("L'idClient est requis pour cette requette");

            return this.livraisonService.findLivraisonIncompleteByIdClient(parseInt(idClient));
        }

        throw new BadRequestException("Requette inconnue");
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
        @ApiBody({type: LivraisonUpdateDto})
        @ApiQuery({name: "statut", required: false, description: "Permet de modifier uniquement le statut de la livraison"})
        @ApiOperation({summary: "Modifier un livraison"})
    update(@Param("id", ParseIntPipe) id: number, @Query("statut") statut: string, @Body() dto?: LivraisonUpdateDto){
        const statutEnum = Object.values(StatusLivraison);
        if(statut && !statutEnum.includes(statut as StatusLivraison)){
            throw new Error("Le statut de la livraison est invalide");
        }

        if(!statut && dto){
            return this.livraisonService.update(id, dto);
        } else if(statut){
            return this.livraisonService.updateStatut(id, statut);
        }
    }

    //* ** COLIS **  */
    @Post("/:id/colis")
    @ApiBody({type: ColisCreateDto})
    @ApiTags("Colis")
    @ApiOperation({summary:"Ajouter un colis à la livraison"})
    addColis(@Param("id", ParseIntPipe) idColis: number, @Body() dto: ColisCreateDto){
        return this.colisService.save(idColis, dto);
    }

    @Get("/:id/colis")
    @ApiTags("Colis")
    @ApiOperation({summary:"Ajouter un colis à la livraison"})
    listeColis(@Param("id", ParseIntPipe) idColis: number){
        return this.colisService.findAllByIdLivraison(idColis);
    }
}
