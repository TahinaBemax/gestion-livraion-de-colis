import { ProblemeColisCreateDto } from './../../common/dto/colis/create-probleme-colis-dto';
import { Body, Controller, Get, Param, ParseIntPipe, Post, Put } from '@nestjs/common';
import { ColisService } from './colis.service';
import { Roles } from 'src/common/decorators/roles.decorator';
import { UserRole } from 'src/common/enum/user-role.enum';
import { ColisCreateDto } from 'src/common/dto/colis/create-colis-dto';
import { ApiBody } from '@nestjs/swagger';
import { ColisUpdateDto } from 'src/common/dto/colis/update-colis-dto';

@Controller('colis')
@Roles(UserRole.Admin)
export class ColisController {
    constructor(private readonly colisService: ColisService){}

    @Get()
    getAll(){
        return this.colisService.findAll();
    }

    @Get("/:id")
    getById(@Param("id", ParseIntPipe) id: number){
        return this.colisService.findById(id);
    }

    @Get("/par-client-code-barre/:code")
    getByCodeBarreClient(@Param("code") code: string){
        return this.colisService.findByCodeBarreClient(code);
    }

    @Post()
    @ApiBody({type: ColisCreateDto})
    save(@Body() dto: ColisCreateDto){
        return this.colisService.save(dto);
    }

    @Put("/:id")
    @ApiBody({type: ColisCreateDto})
    update(@Param("id", ParseIntPipe) id: number, @Body() dto: ColisUpdateDto){
        return this.colisService.update(id, dto);
    }

    @Post("/:id/problemes")
    @ApiBody({type: ColisCreateDto})
    signalProblemeColis(@Param("id", ParseIntPipe) id: number, @Body() dto: ProblemeColisCreateDto){
        return this.colisService.signalProbleme(id, dto);
    }
}
