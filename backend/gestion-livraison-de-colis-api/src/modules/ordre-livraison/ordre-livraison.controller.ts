import { Body, Controller, Delete, Get, Param, Put, ParseIntPipe, Query, BadRequestException } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiParam, ApiBody, ApiQuery } from '@nestjs/swagger';
import { OrdreLivraisonService } from './ordre-livraison.service';
import { OrdreLivraisonUpdateDto } from 'src/common/dto/ordre-livraison/update-ordre-livraison-dto';
import { Roles, UserTypes } from 'src/common/decorators/roles.decorator';
import { UserRole } from 'src/common/enum/user-role.enum';
import { TypeUtilisateur } from 'src/common/enum/type-utilisateur.enum';

@Controller('ordres-livraison')
@ApiTags('Ordre de Livraison')
@Roles(UserRole.Admin, UserRole.ResponsableExploitation)
@UserTypes(TypeUtilisateur.Prestataire, TypeUtilisateur.TempoOne)
export class OrdreLivraisonController {
    constructor(private readonly ordreLivraisonService: OrdreLivraisonService) {}

    @Get()
    @ApiOperation({ summary: 'Liste des ordres de livraison. (Utilisateur Tempo One)' })
    @ApiResponse({ status: 200, description: 'List of ordre livraisons.' })
    @UserTypes(TypeUtilisateur.TempoOne)
    async findAll() {
        return this.ordreLivraisonService.findAll();
    }

    @Get('/historique')
        @ApiOperation({ summary: 'Historique des livraisons (Utilisateur Tempo One)', description: ` Lister les ordres de livraison déjà effectués et en cours de traitement et peut être filtré, par prestataire, par zone géographique, par client, par date` })
        @ApiQuery({name: "idPrestataire", description: "", required: false})
        @ApiQuery({name: "idClient", description: "", required: false})
        @ApiQuery({name: "dateTournee", description: "La date du tournéé", required: false})
        @ApiQuery({name: "zoneGeographique", description: "code postal ou ville", required: false})
        @Roles(UserRole.Admin)
        @UserTypes(TypeUtilisateur.TempoOne)
    async filterBy(
        @Query("idPrestataire") idPrestataire: string|undefined, 
        @Query("idClient") idClient: string|undefined,
        @Query("dateTournee") dateTournee: string|undefined,
        @Query("zoneGeographique") zoneGeographique: string|undefined,
    ) 
    {
        return this.ordreLivraisonService.filterBy(idPrestataire, idClient, dateTournee, zoneGeographique);
    }

    @Get(':id')
    @ApiOperation({ summary: 'Get ordre livraison by id' })
    @ApiParam({ name: 'id', type: 'string' })
    async findOne(@Param('id', ParseIntPipe) id: number) {
        return this.ordreLivraisonService.findById(id);
    }

    @Get('/:id/fiche-ordre-livraison')
    @ApiOperation({ summary: "Fiche ordre de livraison (information complete de l'ordre de livraison)" })
    @ApiParam({ name: 'id', type: 'string' })
    async getFicheOrdreLivraison(@Param('id', ParseIntPipe) id: number) {
        return this.ordreLivraisonService.getFicheOrdreLivraison(id);
    }

    @Put(':id')
        @ApiOperation({ summary: 'Modifier un ordre de livraison' })
        @ApiParam({ name: 'id'})
        @ApiBody({ type: OrdreLivraisonUpdateDto })
    async update(@Param('id', ParseIntPipe) id: number, @Body() updateDto: OrdreLivraisonUpdateDto) {
        return this.ordreLivraisonService.update(id, updateDto);
    }

    @Put('/:id/annule')
        @ApiOperation({ summary: "Annulé la création d'un ordre de livraison"})
        @ApiParam({ name: 'id'})
    async annule(@Param('id', ParseIntPipe) id: number) {
        return this.ordreLivraisonService.annule(id);
    }


    @Delete(':id')
        @ApiOperation({ summary: 'Delete ordre livraison by id' })
        @ApiParam({ name: 'id', type: 'string' })
    async remove(@Param('id', ParseIntPipe) id: number) {
        return this.ordreLivraisonService.delete(id);
    }

    @Delete("/all")
        @ApiOperation({ summary: 'Delete ordre livraison by id tournee and id point de livraison' })
    async removeAll(@Query('idTournee') id: string, @Query('idPL') idPL: string) {
        if (isNaN(Number(id)) || isNaN(Number(idPL))) {
            throw new BadRequestException('Both idTournee and idPL must be numeric.');
        }
        return this.ordreLivraisonService.deleteAllByTourneeAndPointLivraison(parseInt(id), parseInt(idPL));
    }
}
