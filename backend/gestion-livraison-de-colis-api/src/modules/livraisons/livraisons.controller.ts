import { ProblemeLivraisonCreateDto } from './../../common/dto/livraison/create-probleme-livraison-dto';
import { Body, Controller, Get, HttpCode, HttpStatus, Param, ParseIntPipe, Post, Put } from '@nestjs/common';
import { LivraisonsService } from './livraisons.service';
import { LivraisonCreateDto } from 'src/common/dto/livraison/create-livraison-dto';
import { ApiBadRequestResponse, ApiBody, ApiCreatedResponse, ApiNotFoundResponse } from '@nestjs/swagger';

@Controller('livraisons')
export class LivraisonsController {
    constructor(
        private readonly livraisonService: LivraisonsService
    ){}

    @Get()
    getAll(){
        return this.livraisonService.findAll();
    }
    
    @Get("/:id")
    getById(@Param("id", ParseIntPipe) id: number){
        return this.livraisonService.findById(id);
    }

    @Post()
    @HttpCode(HttpStatus.CREATED)
    @ApiBody({type: LivraisonCreateDto})
    @ApiBadRequestResponse()
    @ApiCreatedResponse()
    save(@Body() dto: LivraisonCreateDto){
        return this.livraisonService.save(dto);
    }

    @Put("/:id")
    @HttpCode(HttpStatus.CREATED)
    @ApiBody({type: LivraisonCreateDto})
    @ApiCreatedResponse()
    @ApiBadRequestResponse()
    @ApiNotFoundResponse()
    update(@Param("id", ParseIntPipe) id: number, @Body() dto: LivraisonCreateDto){
        return this.livraisonService.update(id, dto);
    }

    @Post("/:id/problemes")
    @HttpCode(HttpStatus.CREATED)
    @ApiBody({type: ProblemeLivraisonCreateDto})
    @ApiCreatedResponse()
    @ApiBadRequestResponse()
    @ApiNotFoundResponse()
    signalProbleme(@Param("id", ParseIntPipe) id: number, @Body() dto: ProblemeLivraisonCreateDto){
        return this.livraisonService.signalProbleme(id, dto);
    }
}
