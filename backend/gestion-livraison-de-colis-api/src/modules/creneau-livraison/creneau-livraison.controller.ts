import { Body, Controller, Delete, Get, HttpCode, HttpStatus, Param, Post, Put, Query } from '@nestjs/common';
import { CreneauLivraisonService } from './creneau-livraison.service';
import { CreateCreneauLivraisonDto } from 'src/common/dto/creneau-livraison/create-creneau-livraison-dto';
import { UpdateCreneauLivraisonDto } from 'src/common/dto/creneau-livraison/update-creneau-livraison-dto';
import { CreneauLivraisonResponseDto, CreneauLivraisonListResponseDto, CreneauLivraisonDeleteResponseDto } from 'src/common/dto/creneau-livraison/creneau-livraison-response-dto';
import { CreneauLivraisonMapper } from './creneau-livraison.mapper';
import { Roles } from 'src/common/decorators/roles.decorator';
import { UserRole } from 'src/common/enum/user-role.enum';
import { ApiBadRequestResponse, ApiBody, ApiCreatedResponse, ApiOkResponse, ApiOperation, ApiQuery, ApiTags } from '@nestjs/swagger';

@ApiTags('Créneaux de Livraison')
@Controller('creneaux-livraison')
@Roles(UserRole.Admin)
export class CreneauLivraisonController {
    constructor(
        private readonly creneauLivraisonService: CreneauLivraisonService
    ) {}

    @Get()
    @ApiOkResponse({ 
        description: 'Liste de tous les créneaux de livraison', 
        type: CreneauLivraisonListResponseDto 
    })
    async findAll(): Promise<CreneauLivraisonListResponseDto> {
        const entities = await this.creneauLivraisonService.findAll();
        const data = CreneauLivraisonMapper.toResponseDtoList(entities);
        return {
            data,
            total: data.length,
            message: `${data.length} créneau(x) de livraison trouvé(s)`
        };
    }

    @Get('/:id')
    @ApiOkResponse({ 
        description: 'Créneau de livraison trouvé', 
        type: CreneauLivraisonResponseDto 
    })
    @ApiBadRequestResponse({ description: 'Créneau de livraison introuvable' })
    @Roles(UserRole.ResponsableExploitation)
    async findById(@Param('id') id: number): Promise<CreneauLivraisonResponseDto> {
        const entity = await this.creneauLivraisonService.findById(id);
        return CreneauLivraisonMapper.toResponseDto(entity);
    }

    @Get('point-livraison/:id')
    @ApiOkResponse({ 
        description: 'Créneaux de livraison pour un point de livraison', 
        type: CreneauLivraisonListResponseDto 
    })
    @ApiQuery({ name: 'id', description: 'ID du point de livraison' })
    @Roles(UserRole.Admin, UserRole.ResponsableExploitation)
    @ApiOperation({summary: "Lister les créneaux de livraions d'un point de livraison donnée!"})
    async findByPointLivraison(@Param('id') id: number): Promise<CreneauLivraisonListResponseDto> {
        const entities = await this.creneauLivraisonService.findByPointLivraison(id);
        const data = CreneauLivraisonMapper.toResponseDtoList(entities);
        return {
            data,
            total: data.length,
            message: `${data.length} créneau(x) de livraison trouvé(s) pour ce point de livraison`
        };
    }

    // @Get('annee/:annee')
    // @ApiOkResponse({ 
    //     description: 'Créneaux de livraison pour une année', 
    //     type: CreneauLivraisonListResponseDto 
    // })
    // @ApiQuery({ name: 'annee', description: 'Année des créneaux' })
    // @Roles(UserRole.Admin, UserRole.ResponsableExploitation)
    // async findByAnnee(@Param('annee') annee: number): Promise<CreneauLivraisonListResponseDto> {
    //     const entities = await this.creneauLivraisonService.findByAnnee(annee);
    //     const data = CreneauLivraisonMapper.toResponseDtoList(entities);
    //     return {
    //         data,
    //         total: data.length,
    //         message: `${data.length} créneau(x) de livraison trouvé(s) pour l'année ${annee}`
    //     };
    // }

    // @Get('jour/:jourSemaine')
    // @ApiOkResponse({ 
    //     description: 'Créneaux de livraison pour un jour de la semaine', 
    //     type: CreneauLivraisonListResponseDto 
    // })
    // @ApiQuery({ name: 'jourSemaine', description: 'Jour de la semaine' })
    // async findByJourSemaine(@Param('jourSemaine') jourSemaine: string): Promise<CreneauLivraisonListResponseDto> {
    //     const entities = await this.creneauLivraisonService.findByJourSemaine(jourSemaine);
    //     const data = CreneauLivraisonMapper.toResponseDtoList(entities);
    //     return {
    //         data,
    //         total: data.length,
    //         message: `${data.length} créneau(x) de livraison trouvé(s) pour le ${jourSemaine}`
    //     };
    // }

    @Post()
    @HttpCode(HttpStatus.CREATED)
    @ApiBody({ type: CreateCreneauLivraisonDto })
    @ApiCreatedResponse({ 
        description: 'Créneau de livraison créé avec succès', 
        type: CreneauLivraisonResponseDto 
    })
    @ApiBadRequestResponse({ description: 'Données invalides' })
    async create(@Body() data: CreateCreneauLivraisonDto): Promise<CreneauLivraisonResponseDto> {
        const entity = await this.creneauLivraisonService.save(data);
        return CreneauLivraisonMapper.toResponseDto(entity);
    }

    @Put('/:id')
    @ApiBody({ type: UpdateCreneauLivraisonDto })
    @ApiOkResponse({ 
        description: 'Créneau de livraison mis à jour avec succès', 
        type: CreneauLivraisonResponseDto 
    })
    @ApiBadRequestResponse({ description: 'Données invalides ou créneau introuvable' })
    async update(@Param('id') id: number, @Body() data: UpdateCreneauLivraisonDto): Promise<CreneauLivraisonResponseDto> {
        const entity = await this.creneauLivraisonService.update(id, data);
        return CreneauLivraisonMapper.toResponseDto(entity);
    }

    @Delete('/:id')
    @ApiOkResponse({ 
        description: 'Créneau de livraison supprimé avec succès',
        type: CreneauLivraisonDeleteResponseDto
    })
    @ApiOperation({summary: "Supprimer un créneau de livraison"})
    @ApiBadRequestResponse({ description: 'Créneau introuvable' })
    delete(@Param('id') id: number): Promise<CreneauLivraisonDeleteResponseDto> {
        return this.creneauLivraisonService.delete(id);
    }

    @Delete('point-livraison/:id')
    @ApiOperation({summary: "Supprimer des créneaux de livraison par un Point de livraison donné"})
    @ApiOkResponse({ 
        description: 'Créneaux de livraison supprimés avec succès',
        type: CreneauLivraisonDeleteResponseDto
    })
    @ApiQuery({ name: 'id', description: 'ID du point de livraison' })
    deleteByPointLivraison(@Param('id') id: number): Promise<CreneauLivraisonDeleteResponseDto> {
        return this.creneauLivraisonService.deleteByPointLivraison(id);
    }
}
