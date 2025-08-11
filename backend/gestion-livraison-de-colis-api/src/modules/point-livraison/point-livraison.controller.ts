import { Body, Controller, Get, HttpCode, HttpStatus, Param, Post, Put } from '@nestjs/common';
import { PointLivraisonService } from './point-livraison.service';
import { PointLivraisonCreateDto } from 'src/common/dto/point-livraison/point-livraison-create-dto';
import { Roles } from 'src/common/decorators/roles.decorator';
import { UserRole } from 'src/common/enum/user-role.enum';
import { ApiBadRequestResponse, ApiBody, ApiCreatedResponse, ApiNotFoundResponse } from '@nestjs/swagger';
import { PointLivraison } from './point-livraison.entity';

@Controller('points-livraison')
@Roles(UserRole.Admin, UserRole.ResponsableExploitation)
export class PointLivraisonController {
    constructor(
        private readonly plService: PointLivraisonService
    ){}

    @Get()
    findAll(){
        return this.plService.findAll();
    }

    @Get("/:id")
    findById(@Param("id") id: number){
        return this.plService.findById(id);
    }

    @Put("/:id")
    @Roles(UserRole.Admin)
    update(@Param("id") id: number, @Body() data: PointLivraisonCreateDto){
        return this.plService.update(id, data);
    }

    @Post()
    @Roles(UserRole.Admin)
    @HttpCode(HttpStatus.CREATED)
    @ApiBody({type: PointLivraisonCreateDto})
    @ApiCreatedResponse({type: PointLivraison})
    @ApiBadRequestResponse()
    @ApiNotFoundResponse({example: ""})
    create( @Body() data: PointLivraisonCreateDto){
        return this.plService.create(data);
    }
}
