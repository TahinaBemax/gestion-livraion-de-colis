import { Body, Controller, Get, HttpCode, HttpStatus, Param, ParseIntPipe, Post, Put } from '@nestjs/common';
import { ApiTags, ApiOkResponse, ApiBody, ApiCreatedResponse, ApiBadRequestResponse } from '@nestjs/swagger';
import { ContrainteLivraisonDto } from 'src/common/dto/contrainte-livraison/contrainte-livraison-dto';
import { ContrainteLivraisonSwaggerDto } from 'src/common/swagger-dto/contrainte-livraison/contrainte-livraison-swagger-dto';
import { ContrainteLivraisonService } from './contrainte-livraison.service';
import { ContrainteLivraisonEntity } from './contrainte-livraison.entity';
import { Roles } from 'src/common/decorators/roles.decorator';
import { UserRole } from 'src/common/enum/user-role.enum';
import { ContrainteJourDto } from 'src/common/dto/contrainte-jour/contrainte-jour-dto';

@Controller('contraintes-livraisons')
@ApiTags("contraintes-livraisons")
@Roles(UserRole.Admin, UserRole.ResponsableExploitation)
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
    @Roles(UserRole.Admin)
    @HttpCode(HttpStatus.CREATED)
    @ApiBody({type: ContrainteLivraisonDto})
    @ApiCreatedResponse({type: ContrainteLivraisonDto})
    @ApiBadRequestResponse({description: "Données Invalides"})
    save(@Body() dto: ContrainteLivraisonDto){
        return this.contrainteService.save(dto);
    }

    @Put("/:id")
    @Roles(UserRole.Admin)
    @HttpCode(HttpStatus.CREATED)
    @ApiBody({type: ContrainteLivraisonDto})
    @ApiCreatedResponse({type: ContrainteLivraisonSwaggerDto})
    @ApiBadRequestResponse({description: "Données Invalides"})
    update(@Param("id", ParseIntPipe) id: number, @Body() dto: ContrainteLivraisonDto) {
        return this.contrainteService.update(id, dto);
    }
    
    @Post("/:id/contraintes-jours")
    @Roles(UserRole.Admin)
    @HttpCode(HttpStatus.CREATED)
    @ApiBody({type: ContrainteJourDto})
    @ApiCreatedResponse({type: ContrainteLivraisonSwaggerDto})
    @ApiBadRequestResponse({description: "Données Invalides"})
    addDayConstraintToDeliveryConstraint(@Param("id", ParseIntPipe) id: number, @Body() dto: ContrainteJourDto[]){
        return this.contrainteService.attachDayConstraintsToDeliveryConstraint(id, dto);
    }
}