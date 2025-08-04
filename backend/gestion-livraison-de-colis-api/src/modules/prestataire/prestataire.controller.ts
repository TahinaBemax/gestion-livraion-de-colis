import { Prestataire } from 'src/modules/prestataire/prestataire.entity';
import { PrestataireCreateDto } from 'src/common/dto/prestataire/create-prestataire-dto';
import { Body, Controller, Delete, Get, Param, Post, Put, Query } from '@nestjs/common';
import { PrestataireService } from './prestataire.service';
import { User } from '../user/user.entity';

@Controller('prestataires')
export class PrestataireController {
    constructor(private readonly prestataireService: PrestataireService){}

    @Post()
    create(@Body() data: PrestataireCreateDto){
        return this.prestataireService.create(data);
    }

    @Put()
    update(@Body() data: Prestataire){
        return this.prestataireService.update(data)
    }

    @Get()
    findAll() {
        return this.prestataireService.findAll();
    }

    @Get('/filterBy')
    filterBy(@Query('nom') nom?:string, @Query('prenom') prenom?:string, @Query('nomEntreprise') nomEntreprise?:string): Promise<Prestataire[]> {
        return this.prestataireService.filterBy(nom, prenom, nomEntreprise);
    }

    @Get(":id")
    findById(@Param("id") id:number) {
        return this.prestataireService.findById(id);
    }

    @Delete(":id")
    desactivatePrestataireAccount(@Param('id') id:number) {
        return this.prestataireService.desactivate(id);
    }

    @Put(":id/activate-account")
    activate(@Param('id') id:number){
        return this.prestataireService.activate(id);
    }
}
