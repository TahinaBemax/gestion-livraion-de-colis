import { Body, Controller, Get, HttpCode, HttpStatus, Param, Post, Put } from '@nestjs/common';
import { ContrainteJourLivraisonService } from './contrainte-jour-livraison.service';
import { ApiOkResponse, ApiBody, ApiCreatedResponse, ApiBadRequestResponse } from '@nestjs/swagger';
import { ContrainteJourLivraisonDto } from 'src/common/dto/contrainte-jour-livraison/contrainte-jour-livraison-dto';
import { ContrainteJourLivraison } from './contrainte-jour-livraison.entity';


@Controller('contraintes-jours-livraisons')
export class ContrainteJourLivraisonController {
    constructor(
        private readonly cotrainteJourService: ContrainteJourLivraisonService
    ){}

    @Get("/:id")
    @ApiOkResponse({type: ContrainteJourLivraison})
    getOneById(@Param("id") id: number) {
        return this.cotrainteJourService.findById(id);
    }

    @Get()
    @ApiOkResponse({type: [ContrainteJourLivraison]})
    getAll() {
        return this.cotrainteJourService.findAll();
    }

    @Post()
    @HttpCode(HttpStatus.CREATED)
    @ApiBody({type: ContrainteJourLivraisonService})
    @ApiCreatedResponse({type: ContrainteJourLivraisonService})
    @ApiBadRequestResponse({description: "Données Invalides"})
    save(@Body() dto: ContrainteJourLivraisonDto){
        return this.cotrainteJourService.save(dto);
    }

    @Put("/:id")
    @HttpCode(HttpStatus.CREATED)
    @ApiBody({type: ContrainteJourLivraisonService})
    @ApiCreatedResponse({type: ContrainteJourLivraisonService})
    @ApiBadRequestResponse({description: "Données Invalides"})
    update(@Param("id") id: number, @Body() dto: ContrainteJourLivraisonDto) {
        return this.cotrainteJourService.update(id, dto);
    }    
}
