import { Body, Controller, Get, Param, Post, Put } from '@nestjs/common';
import { PointLivraisonService } from './point-livraison.service';
import { PointLivraisonCreateDto } from 'src/common/dto/point-livraison/point-livraison-create-dto';
import { Roles } from 'src/common/decorators/roles.decorator';
import { UserRole } from 'src/common/enum/user-role.enum';

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
    create( @Body() data: PointLivraisonCreateDto){
        return this.plService.create(data);
    }
}
