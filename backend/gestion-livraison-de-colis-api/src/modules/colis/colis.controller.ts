import { ProblemeColisCreateDto } from './../../common/dto/colis/create-probleme-colis-dto';
import { BadRequestException, Body, Controller, Get, Param, ParseIntPipe, Post, Put } from '@nestjs/common';
import { ColisService } from './colis.service';
import { Roles } from 'src/common/decorators/roles.decorator';
import { UserRole } from 'src/common/enum/user-role.enum';
import { ColisCreateDto } from 'src/common/dto/colis/create-colis-dto';
import { ApiBody, ApiOperation, ApiQuery } from '@nestjs/swagger';
import { ColisUpdateDto } from 'src/common/dto/colis/update-colis-dto';

@Controller('colis')
@Roles(UserRole.Admin)
export class ColisController {
    constructor(private readonly colisService: ColisService){}

    // @Get()
    // @ApiOperation({summary:"Liste des colis"})
    // getAll(){
    //     return this.colisService.findAll();
    // }

    @Get("/:id")
    getById(@Param("id", ParseIntPipe) id: number){
        return this.colisService.findById(id);
    }

    @Get("")
    @ApiOperation({summary:"Rechercher un colis par un CODE BARRE client. C-a-d l'identifiant unique que le client seul l'a"})
    @ApiQuery({name: "code", required: true, example: "CBA1234567890", description: "Le code barre client du colis"})
    getByCodeBarreClient(@Param("code") code: string){
        if(!code){
            throw new BadRequestException("Le code barre client est obligatoire");
        }
        return this.colisService.findByCodeBarreClient(code);
    }
    
    
    @Put("/:id")
    @ApiBody({type: ColisUpdateDto})
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
