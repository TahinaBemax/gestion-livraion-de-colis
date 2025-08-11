import { Body, Controller, Get, HttpCode, HttpStatus, Param, Post, Put, Query } from '@nestjs/common';
import { ContrainteLivraisonService } from './contrainte-livraison.service';
import { ContrainteLivraisonDto } from 'src/common/dto/contrainte-livraison/contrainte-livraison-dto';
import { ApiBadRequestResponse, ApiBody, ApiCreatedResponse, ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { ContrainteLivraison } from './contrainte-livraison.entity';
import { ContrainteLivraisonSwaggerDto } from 'src/common/swagger-dto/contrainte-livraison/contrainte-livraison-swagger-dto';

@Controller('contraintes-livraisons')
@ApiTags("contraintes-livraisons")
export class ContrainteLivraisonController {
    constructor(private readonly contrainteService: ContrainteLivraisonService){}

    @Get("/:id")
    @ApiOkResponse({type: ContrainteLivraison})
    getOneById(@Param("id") id: number) {
        return this.contrainteService.findById(id);
    }

    @Get()
    @ApiOkResponse({type: [ContrainteLivraison]})
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
