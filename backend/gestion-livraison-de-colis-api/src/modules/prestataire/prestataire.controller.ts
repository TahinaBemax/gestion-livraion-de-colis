import { BadRequestException, Body, Controller, Get, Param, Post, Put} from '@nestjs/common';
import { PrestataireService } from './prestataire.service';
import { CreateLivreurDto } from 'src/common/dto/livreur/create-livreur-dto';
import { Livreur } from '../livreur/livreur.entity';
import { LivreurService } from '../livreur/livreur.service';
import { UserRole } from 'src/common/enum/user-role.enum';
import { Roles } from 'src/common/decorators/roles.decorator';
import { PointLivraisonService } from '../point-livraison/point-livraison.service';


@Controller('prestataires')
@Roles(UserRole.ResponsableExploitation)
export class PrestataireController {
    constructor(
        private readonly prestataireService: PrestataireService,
        private readonly livreurService: LivreurService,
        private readonly plService: PointLivraisonService,
    ){}

    @Get("/:id/profile")
    @Roles(UserRole.ResponsableExploitation, UserRole.Admin)
    findById(@Param("id") id:number) {
        return this.prestataireService.findById(id);
    }

    @Get("/:id/livreurs")
    @Roles(UserRole.Admin, UserRole.ResponsableExploitation)
    findLivreurByIdPrestataire(@Param("id") id_prestataire: number){
        return this.livreurService.findAllLivreursByPrestataire(id_prestataire);
    }

    @Get("/:id/responsable-exploitation")
    @Roles(UserRole.Admin, UserRole.ResponsableExploitation)
    findResponsableExploitationByIdPrestataire(@Param("id") id_prestataire: number){
        return this.prestataireService.findReponsableExploitation(id_prestataire);
    }

    @Post("/livreurs")
    createLivreur(@Body() data: CreateLivreurDto){
        return this.livreurService.create(data);
    }

    @Put("/:id/livreurs")
    updateLivreur(@Param("id") id_prestataire: number, @Body() data: Livreur){
        return this.livreurService.update(id_prestataire, data);
    }

    @Put("/:idPrestataire/livreurs/:idLivreur/desactivate")
    desactivateLivreur(@Param("idPrestataire") id_prestataire: number, @Param("idLivreur") idLivreur: number){
        return this.livreurService.desactivateAccount(id_prestataire, idLivreur);
    }

    @Put("/:idPrestataire/livreurs/:idLivreur/activate")
    activateLivreur(@Param("idPrestataire") id_prestataire: number, @Param("idLivreur") idLivreur: number){
        return this.livreurService.activateAccount(id_prestataire, idLivreur);
    }

    /* POINT DE LIVRAISON */
    @Post("/:id/points-livraison")
    @Roles(UserRole.Admin)
    async assignDeliveryPointsToProvider(@Param("id") id: number, @Body() pointsLivraison: {ids: number[] } ){
        const prestataire = await this.prestataireService.findById(id);

        if(!prestataire) throw new BadRequestException(`Prestataire avec id:${id} Introuvable`);
        return this.plService.assignDeliveryPointsToProvider(prestataire, pointsLivraison.ids);
    }

    @Get("/:id/points-livraison")
    @Roles(UserRole.Admin)
    async getProviderDeliveryPoints(@Param("id") id: number){
        return this.plService.findByPrestataire(id);
    }
}
