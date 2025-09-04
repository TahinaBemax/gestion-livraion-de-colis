import { Body, Controller, Delete, Get, Param, Patch, Post, Put, ParseIntPipe, Query, BadRequestException } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiParam, ApiBody } from '@nestjs/swagger';
import { OrdreLivraisonService } from './ordre-livraison.service';
import { OrdreLivraisonUpdateDto } from 'src/common/dto/ordre-livraison/update-ordre-livraison-dto';

@Controller('ordres-livraison')
@ApiTags('Ordre de Livraison')
export class OrdreLivraisonController {
    constructor(private readonly ordreLivraisonService: OrdreLivraisonService) {}

    @Get()
    @ApiOperation({ summary: 'Get all ordre livraisons' })
    @ApiResponse({ status: 200, description: 'List of ordre livraisons.' })
    async findAll() {
        return this.ordreLivraisonService.findAll();
    }

    @Get('/historiques')
    @ApiOperation({ summary: 'Get all ordre livraisons' })
    @ApiResponse({ status: 200, description: 'List of ordre livraisons.' })
    async filterBy(
        @Query("idPrestataire") idPrestataire: string|undefined, 
        @Query("idClient") idClient: string|undefined,
        @Query("dateLivraison") dateLivraison: string|undefined,
        @Query("zoneGeographique") zoneGeographique: string|undefined,
    ) 
    {
        return this.ordreLivraisonService.filterBy(idPrestataire, idClient, dateLivraison, zoneGeographique);
    }

    @Get(':id')
    @ApiOperation({ summary: 'Get ordre livraison by id' })
    @ApiParam({ name: 'id', type: 'string' })
    @ApiResponse({ status: 200, description: 'Ordre livraison found.' })
    @ApiResponse({ status: 404, description: 'Ordre livraison not found.' })
    async findOne(@Param('id', ParseIntPipe) id: number) {
        return this.ordreLivraisonService.findById(id);
    }

    @Get('/:id/fiche-ordre-livraison')
    @ApiOperation({ summary: 'Get ordre livraison by id' })
    @ApiParam({ name: 'id', type: 'string' })
    @ApiResponse({ status: 200, description: 'Ordre livraison found.' })
    @ApiResponse({ status: 404, description: 'Ordre livraison not found.' })
    async getFicheOrdreLivraison(@Param('id', ParseIntPipe) id: number) {
        return this.ordreLivraisonService.getFicheOrdreLivraison(id);
    }

    @Put(':id')
    @ApiOperation({ summary: 'Replace ordre livraison by id' })
    @ApiParam({ name: 'id', type: 'string' })
    @ApiBody({ type: OrdreLivraisonUpdateDto })
    @ApiResponse({ status: 200, description: 'Ordre livraison updated.' })
    @ApiResponse({ status: 404, description: 'Ordre livraison not found.' })
    async update(@Param('id', ParseIntPipe) id: number, @Body() updateDto: OrdreLivraisonUpdateDto) {
        return this.ordreLivraisonService.update(id, updateDto);
    }


    @Delete(':id')
    @ApiOperation({ summary: 'Delete ordre livraison by id' })
    @ApiParam({ name: 'id', type: 'string' })
    @ApiResponse({ status: 200, description: 'Ordre livraison deleted.' })
    @ApiResponse({ status: 404, description: 'Ordre livraison not found.' })
    async remove(@Param('id', ParseIntPipe) id: number) {
        return this.ordreLivraisonService.delete(id);
    }

    @Delete("/all")
    @ApiOperation({ summary: 'Delete ordre livraison by id tournee and id point de livraison' })
    @ApiResponse({ status: 200, description: 'Ordre livraison deleted.' })
    @ApiResponse({ status: 404, description: 'Ordre livraison not found.' })
    async removeAll(@Query('idTournee') id: string, @Query('idPL') idPL: string) {
        if (isNaN(Number(id)) || isNaN(Number(idPL))) {
            throw new BadRequestException('Both idTournee and idPL must be numeric.');
        }
        return this.ordreLivraisonService.deleteAllByTourneeAndPointLivraison(parseInt(id), parseInt(idPL));
    }
}
