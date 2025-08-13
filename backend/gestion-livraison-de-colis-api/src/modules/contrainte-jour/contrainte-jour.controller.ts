import {  Controller, Get, Param,  } from '@nestjs/common';
import { ContrainteJourEntity } from './contrainte-jour.entity';
import { ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { ContrainteJourService } from './contrainte-jour.service';
import { Roles } from 'src/common/decorators/roles.decorator';
import { UserRole } from 'src/common/enum/user-role.enum';

@Controller('contraintes-jours')
@ApiTags("Contraintes Jours")
@Roles(UserRole.Admin, UserRole.ResponsableExploitation)
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

    // @Post()
    // @HttpCode(HttpStatus.CREATED)
    // @ApiBody({type: ContrainteJourEntity})
    // @ApiCreatedResponse({type: ContrainteJourEntity})
    // @ApiBadRequestResponse({description: "Données Invalides"})
    // save(@Body() dto: ContrainteJourDto){
    //     return this.cotrainteJourService.save(dto);
    // }

    // @Put("/:id")
    // @HttpCode(HttpStatus.CREATED)
    // @ApiBody({type: ContrainteJourEntity})
    // @ApiCreatedResponse({type: ContrainteJourEntity})
    // @ApiBadRequestResponse({description: "Données Invalides"})
    // update(@Param("id") id: number, @Body() dto: ContrainteJourDto) {
    //     return this.cotrainteJourService.update(id, dto);
    // }    
}