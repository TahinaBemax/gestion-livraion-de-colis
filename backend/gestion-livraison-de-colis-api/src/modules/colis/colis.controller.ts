import { ProblemeColisCreateDto } from './../../common/dto/colis/create-probleme-colis-dto';
import { Body, Controller, Get, Param, ParseIntPipe, Post, Put } from '@nestjs/common';
import { ColisService } from './colis.service';
import { Roles } from 'src/common/decorators/roles.decorator';
import { UserRole } from 'src/common/enum/user-role.enum';
import { ColisCreateDto } from 'src/common/dto/colis/create-colis-dto';
import { ApiBody, ApiOperation } from '@nestjs/swagger';
import { ColisUpdateDto } from 'src/common/dto/colis/update-colis-dto';

@Controller('colis')
@Roles(UserRole.Admin)
export class ColisController {
    constructor(private readonly colisService: ColisService){}

    @Get()
    @ApiOperation({summary:"Liste des colis"})
    getAll(){
        return this.colisService.findAll();
    }

    @Get("/:id")
    getById(@Param("id", ParseIntPipe) id: number){
        return this.colisService.findById(id);
    }

    @Get("/par-client-code-barre/:code")
    @ApiOperation({summary:"Rechercher un colis par un CODE BARRE client. C-a-d l'identifiant unique que le client seul l'a"})
    @ApiOperation({summary:"Rechercher un colis par un CODE BARRE client. C-a-d l'identifiant unique que le client seul l'a"})
    getByCodeBarreClient(@Param("code") code: string){
        return this.colisService.findByCodeBarreClient(code);
    }
    
    @Post()
    @ApiBody({type: ColisCreateDto})
    @ApiOperation({summary:"Ajouter un colis"})
    save(@Body() dto: ColisCreateDto){
        return this.colisService.save(dto);
    }
    
    @Put("/:id")
    @ApiBody({type: ColisCreateDto})
    @ApiOperation({summary:"Modifier l'information du colis"})
    update(@Param("id", ParseIntPipe) id: number, @Body() dto: ColisUpdateDto){
        return this.colisService.update(id, dto);
    }

    // @Post("/:id/problemes")
    // @ApiBody({type: ColisCreateDto})
    // signalProblemeColis(@Param("id", ParseIntPipe) id: number, @Body() dto: ProblemeColisCreateDto){
    //     return this.colisService.signalProbleme(id, dto);
    // }
}
