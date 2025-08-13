import { Body, Controller, Get, HttpCode, HttpStatus, Param, ParseIntPipe, Post, Put } from '@nestjs/common';
import { ApiTags, ApiBody, ApiCreatedResponse } from '@nestjs/swagger';
import { Roles } from 'src/common/decorators/roles.decorator';
import { UserRole } from 'src/common/enum/user-role.enum';
import { EvenementLocalDto } from 'src/common/dto/evenement-local/evenement-local-dto';
import { UpdateEvenementLocalDto } from 'src/common/dto/evenement-local/update-evenement-local-dto';
import { EvenementLocalService } from './evenement-local.service';
import { EvenementLocalEntity } from './evenement-local.entity';

@Controller('animations-villes')
@ApiTags('Animation Ville')
@Roles(UserRole.Admin, UserRole.ResponsableExploitation)
export class EvenementLocalController {
    constructor(private readonly evenemtnService: EvenementLocalService){}

    @Get()
    getAll(): Promise<EvenementLocalEntity[]>{
        return this.evenemtnService.findAll();
    }

    @Get("/:id")
    getById(@Param("id", ParseIntPipe) id:number): Promise<EvenementLocalEntity> {
        return this.evenemtnService.findById(id);
    } 

    @Post()
    @HttpCode(HttpStatus.CREATED)
    @ApiBody({type: EvenementLocalDto})
    @ApiCreatedResponse()
    save(@Body() dto: EvenementLocalDto): Promise<EvenementLocalEntity> {
        return this.evenemtnService.save(dto);
    }

    @Put("/:id")
    @ApiBody({type: UpdateEvenementLocalDto})
    @ApiCreatedResponse()
    update(@Param("id", ParseIntPipe) id:number, @Body() dto: UpdateEvenementLocalDto): Promise<EvenementLocalEntity> {
        return this.evenemtnService.update(id, dto);
    }
}
