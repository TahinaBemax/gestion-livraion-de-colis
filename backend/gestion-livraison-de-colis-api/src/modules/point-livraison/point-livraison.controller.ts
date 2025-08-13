import { Body, Controller, Get, HttpCode, HttpStatus, Param, Post, Put } from '@nestjs/common';
import { PointLivraisonService } from './point-livraison.service';
import { CreatePointLivraisonDto } from 'src/common/dto/point-livraison/point-livraison-create-dto';
import { Roles } from 'src/common/decorators/roles.decorator';
import { UserRole } from 'src/common/enum/user-role.enum';
import { ApiBadRequestResponse, ApiBody, ApiCreatedResponse } from '@nestjs/swagger';
import { PointLivraisonEntity } from './point-livraison.entity';

@Controller('points-livraisons')
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
    update(@Param("id") id: number, @Body() data: CreatePointLivraisonDto){
        return this.plService.update(id, data);
    }

    @Post()
    @Roles(UserRole.Admin)
    @HttpCode(HttpStatus.CREATED)
    @ApiBody({type: CreatePointLivraisonDto})
    @ApiCreatedResponse({type: PointLivraisonEntity})
    @ApiBadRequestResponse()
    create( @Body() data: CreatePointLivraisonDto){
        return this.plService.create(data);
    }
}
