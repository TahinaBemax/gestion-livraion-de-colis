import { Body, Controller, Get, HttpCode, HttpStatus, Param, Post, Put } from '@nestjs/common';
import { ApiTags, ApiOkResponse, ApiBody, ApiCreatedResponse, ApiBadRequestResponse } from '@nestjs/swagger';
import { ContrainteLivraisonDto } from 'src/common/dto/contrainte-livraison/contrainte-livraison-dto';
import { ContrainteLivraisonSwaggerDto } from 'src/common/swagger-dto/contrainte-livraison/contrainte-livraison-swagger-dto';
import { ContrainteLivraisonService } from './contrainte-livraison.service';
import { ContrainteLivraisonEntity } from './contrainte-livraison.entity';

@Controller('contraintes-livraisons')
@ApiTags("contraintes-livraisons")
export class ContrainteLivraisonController {
    constructor(private readonly contrainteService: ContrainteLivraisonService){}

    @Get("/:id")
    @ApiOkResponse({type: ContrainteLivraisonEntity})
    getOneById(@Param("id") id: number) {
        return this.contrainteService.findById(id);
    }

    @Get()
    @ApiOkResponse({type: [ContrainteLivraisonEntity]})
    getAll() {
        return this.contrainteService.findAll();
    }

    @Post()
    @HttpCode(HttpStatus.CREATED)
    @ApiBody({type: ContrainteLivraisonDto})
    @ApiCreatedResponse({type: ContrainteLivraisonDto})
    @ApiBadRequestResponse({description: "Données Invalides"})
    save(@Body() dto: ContrainteLivraisonDto){
        return this.contrainteService.save(dto);
    }

    @Put("/:id")
    @HttpCode(HttpStatus.CREATED)
    @ApiBody({type: ContrainteLivraisonDto})
    @ApiCreatedResponse({type: ContrainteLivraisonSwaggerDto})
    @ApiBadRequestResponse({description: "Données Invalides"})
    update(@Param("id") id: number, @Body() dto: ContrainteLivraisonDto) {
        return this.contrainteService.update(id, dto);
    }
}