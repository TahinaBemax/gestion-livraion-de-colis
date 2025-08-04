import { Controller, Get, Param} from '@nestjs/common';
import { PrestataireService } from './prestataire.service';


@Controller('prestataires')
export class PrestataireController {
    constructor(private readonly prestataireService: PrestataireService){}

    @Get("/:id/profile")
    findById(@Param("id") id:number) {
        return this.prestataireService.findById(id);
    }
}
