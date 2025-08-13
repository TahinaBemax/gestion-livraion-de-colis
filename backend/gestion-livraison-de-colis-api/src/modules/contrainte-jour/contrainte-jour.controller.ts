import { Body, Controller, Get, HttpCode, HttpStatus, Param, Post, Put } from '@nestjs/common';
import { ContrainteJourEntity } from './contrainte-jour.entity';
import { ApiOkResponse, ApiBody, ApiCreatedResponse, ApiBadRequestResponse } from '@nestjs/swagger';
import { ContrainteJourService } from './contrainte-jour.service';
import { ContrainteJourDto } from 'src/common/dto/contrainte-jour/contrainte-jour-dto';

@Controller('contraintes-jours')
export class ContrainteJourController {
    constructor(
        private readonly cotrainteJourService: ContrainteJourService
    ){}

    @Get("/:id")
    @ApiOkResponse({type: ContrainteJourEntity})
    getOneById(@Param("id") id: number) {
        return this.cotrainteJourService.findById(id);
    }

    @Get()
    @ApiOkResponse({type: [ContrainteJourEntity]})
    getAll() {
        return this.cotrainteJourService.findAll();
    }

    @Post()
    @HttpCode(HttpStatus.CREATED)
    @ApiBody({type: ContrainteJourEntity})
    @ApiCreatedResponse({type: ContrainteJourEntity})
    @ApiBadRequestResponse({description: "Données Invalides"})
    save(@Body() dto: ContrainteJourDto){
        return this.cotrainteJourService.save(dto);
    }

    @Put("/:id")
    @HttpCode(HttpStatus.CREATED)
    @ApiBody({type: ContrainteJourEntity})
    @ApiCreatedResponse({type: ContrainteJourEntity})
    @ApiBadRequestResponse({description: "Données Invalides"})
    update(@Param("id") id: number, @Body() dto: ContrainteJourDto) {
        return this.cotrainteJourService.update(id, dto);
    }    
}