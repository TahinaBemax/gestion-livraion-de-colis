import { Body, Controller, Delete, Get, Param, ParseIntPipe, Post, Put } from '@nestjs/common';
import { ApiBody, ApiCreatedResponse, ApiNotFoundResponse, ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { LivreurTemporaireService } from './livreur-temporaire/livreur-temporaire.service';
import { LivreurTemporaireDto } from 'src/common/dto/livreur/livreur-temporaire-dto';
import { LivreurTemporaireUpdateDto } from 'src/common/dto/livreur/update-livreur-temporaire-dto';

@Controller('livreurs')
@ApiTags("Livreur Temporaire")
export class LivreurController {
    constructor(
        private readonly livreurTempService: LivreurTemporaireService
    ){}

    @Get("/:id")
    @ApiOkResponse()
    @ApiNotFoundResponse()
    getAllByDeliveryID(@Param("id", ParseIntPipe) id: number){
        return this.livreurTempService.findAllByDeliveryID(id);
    }

    @Get("/temporaire/:idTemp")
    @ApiOkResponse()
    @ApiNotFoundResponse()
    getByIdTemporaryDeliveryID(@Param("id", ParseIntPipe) id: number){
        return this.livreurTempService.findById(id);
    }

    @Post('/:id/temporaire')
    @ApiBody({type: LivreurTemporaireDto})
    @ApiCreatedResponse()
    @ApiNotFoundResponse()
    save(@Param("id", ParseIntPipe) id: number, @Body() dto: LivreurTemporaireDto){
        return this.livreurTempService.save(id, dto);
    }

    @Put('/:id/temporaire/:idLivreurTemp')
    @ApiBody({type: LivreurTemporaireUpdateDto})
    @ApiCreatedResponse()
    @ApiNotFoundResponse()
    update(@Param("id", ParseIntPipe) id: number,@Param("idLivreurTemp", ParseIntPipe) idLivreurTemp:number, @Body() dto: LivreurTemporaireUpdateDto){
        return this.livreurTempService.update(id, idLivreurTemp, dto);
    }

    @Delete('/temporaire/:id')
    @ApiBody({type: LivreurTemporaireUpdateDto})
    @ApiOkResponse()
    @ApiNotFoundResponse()
    desactivateAccount(@Param("id", ParseIntPipe) id: number){
        return this.livreurTempService.delete(id);
    }
}
