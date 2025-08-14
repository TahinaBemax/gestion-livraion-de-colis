import { BadRequestException, Body, Controller, Get, HttpCode, HttpStatus, Param, ParseIntPipe, Post, Put, Query } from '@nestjs/common';
import { PointLivraisonService } from './point-livraison.service';
import { CreatePointLivraisonDto } from 'src/common/dto/point-livraison/point-livraison-create-dto';
import { Roles } from 'src/common/decorators/roles.decorator';
import { UserRole } from 'src/common/enum/user-role.enum';
import { ApiBadRequestResponse, ApiBody, ApiCreatedResponse, ApiInternalServerErrorResponse, ApiNotFoundResponse, ApiOperation, ApiParam } from '@nestjs/swagger';
import { PointLivraisonEntity } from './point-livraison.entity';

@Controller('points-livraisons')
@Roles(UserRole.Admin)
export class PointLivraisonController {
    constructor(
        private readonly plService: PointLivraisonService
    ){}

    @Get()
    findAll(){
        return this.plService.findAll();
    }

    @Get("/filtrer-par")
    @ApiBadRequestResponse()
    getAllByCityAndNumeroMagasin(@Query("city") city:string, @Query("num_magasin") numMagasin: string): Promise<PointLivraisonEntity[]>{
        return this.plService.findByCityNumeroMagasin(city, numMagasin);
    }

    @Get("/:id")
    findById(@Param("id") id: number){
        return this.plService.findById(id);
    }

    @Put("/:id")
    update(@Param("id", ParseIntPipe) id: number, @Body() data: CreatePointLivraisonDto){
        return this.plService.update(id, data);
    }

    @Post()
    @HttpCode(HttpStatus.CREATED)
    @ApiBody({type: CreatePointLivraisonDto})
    @ApiCreatedResponse({type: PointLivraisonEntity})
    @ApiBadRequestResponse()
    create( @Body() data: CreatePointLivraisonDto){
        return this.plService.create(data);
    }

    @Post("/:id/rattacher-contraintes-livraison")
    @ApiParam({name: "id", description: "ID du point de livraison"})
    @ApiBody({type: [Number], description: "Les id des contraintes de livraison"})
    @ApiOperation({summary: "Rattacher des contraintes de livraison à un point de livraison"})
    @ApiCreatedResponse({description: "Contraintes de livraison rattachée avec succés!", type: String})
    @ApiBadRequestResponse({description: "Données invalides"})
    @ApiInternalServerErrorResponse({description: "Internal server error"})
    async assignDeliveryConstraintsToPL(@Param("id") id: number, @Body() constraintsLivraison: {ids: number[] } ){
        if(!constraintsLivraison || !id) throw new BadRequestException(`Données invalide`);
        return this.plService.assignDeliveryConstraintsToPL(id, constraintsLivraison.ids);
    }
}
