import { BordereauLivraisonCreateDto } from 'src/common/dto/bordereau-livraison/create-bordereau-livraison-dto';
import { Body, Controller, Delete, Get, Param, ParseIntPipe, Post, Put, Query, Res } from '@nestjs/common';
import { Response } from 'express';
import { BordereauLivraisonService } from './bordereau-livraison.service';
import { ApiBody, ApiOperation, ApiParam, ApiTags } from '@nestjs/swagger';
import { Roles, UserTypes } from 'src/common/decorators/roles.decorator';
import { UserRole } from 'src/common/enum/user-role.enum';
import { TypeUtilisateur } from 'src/common/enum/type-utilisateur.enum';
import { PdfService } from 'src/core/pdf/pdf.service';

@Controller('bordereaux-livraison')
@ApiTags("Bordereau de livraison")
@Roles(UserRole.Admin)
@UserTypes(TypeUtilisateur.Prestataire, TypeUtilisateur.TempoOne)
export class BordereauLivraisonController {
    constructor(
        readonly bordereauService: BordereauLivraisonService,
        readonly pdfService: PdfService
    ){}
    
    /**
     * CREATION D'UN BORDEREAU DE LIVRAISON
     * @param dto Données bordereau de livraison
     * @returns Bordereau de livraison enregistré
     */
    @Post()
        @ApiOperation({summary: "Créer un bordereau de livraison"})
        @ApiBody({type: BordereauLivraisonCreateDto})
    async save(@Body() dto: BordereauLivraisonCreateDto){
        return await this.bordereauService.create(dto);
    }

        /**
     * CREATION D'UN BORDEREAU DE LIVRAISON
     * @param dto Données bordereau de livraison
     * @returns Bordereau de livraison enregistré
     */
    @Post("/:refBordereau/proof-of-delivery")
        @Roles(UserRole.User, UserRole.Admin)
        @UserTypes(TypeUtilisateur.Livreur, TypeUtilisateur.TempoOne)
        @ApiOperation({summary: "Preuve de livraison"})
        @ApiParam({name: "refBordereau", description: "Référence du bordereau de livraison"})
    async proofOfDelivery(@Param("refBordereau") refBordereau: string){
        return await this.bordereauService.proofOfDelivery(refBordereau);
    }

    /**
     * CREATION D'UN BORDEREAU DE LIVRAISON
     * @param dto Données bordereau de livraison
     * @returns Bordereau de livraison enregistré
     */
    @Put("/scan")
        @Roles(UserRole.User)
        @UserTypes(TypeUtilisateur.Livreur)
        @ApiOperation({summary: "Scanner le bordereau de livraison"})
    async scanBordereauLivraison(
        @Query("idOrdreLivraison", ParseIntPipe) idOrdreLivraison: number,
        @Query("idLivreur", ParseIntPipe) idLivreur: number
    ){
        const response = await this.bordereauService.scanBordereauLivraison(idOrdreLivraison, idLivreur);
        if(response){
            return {est_reussi: true, message: "Scan réussi!"};
        }

        return {est_reussi: false, message: "Scan échoué!"};
    }

        /**
         * LISTE LES BORDEREAUX DE LIVRAISON
         * @returns Liste des bordereaux de livraison
         */
    @Get()
    async getAll(){
        return await this.bordereauService.findAll()
    }
        
    /**
     * DETAIL D'UN BORDEREAUX DE LIVRAISON
     * @returns Un bordereaux de livraison
    */
    @Get("/:id")
    async getById(@Param("id") id: string){
        return await this.bordereauService.findById(id);
    }


    @Get('/:id/pdf')
        @ApiOperation({summary: "Exporter le bordereau de livraison en pdf"})
    async getBonLivraison(@Param('id') id: string, @Res({ passthrough: false }) res: Response) {
        const bl = await this.bordereauService.findById(id);
        const fileName = id + "_" + new Date().toISOString();

        const pdfBuffer = await this.pdfService.generateBonLivraison(bl);
        res.setHeader('Content-Type', 'application/pdf');
        res.setHeader('Content-Disposition', `inline; filename="${fileName}.pdf"`);
        res.setHeader('Content-Length', pdfBuffer.length);
        
        res.end(pdfBuffer);
    }

    @Delete("/:id")
    async delete(@Param("id") id: string){
        return await this.bordereauService.delete(id);
    }
}
