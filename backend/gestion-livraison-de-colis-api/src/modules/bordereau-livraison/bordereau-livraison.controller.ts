import { BarcodeService } from './../../core/code_barre/code_barre.service';
import { BordereauLivraisonCreateDto } from 'src/common/dto/bordereau-livraison/create-bordereau-livraison-dto';
import { Body, Controller, Get, Param, Post, Res } from '@nestjs/common';
import { Response } from 'express';
import { BordereauLivraisonService } from './bordereau-livraison.service';
import { ApiBody, ApiTags } from '@nestjs/swagger';
import { Roles, UserTypes } from 'src/common/decorators/roles.decorator';
import { UserRole } from 'src/common/enum/user-role.enum';
import { TypeUtilisateur } from 'src/common/enum/type-utilisateur.enum';
import { PdfService } from 'src/core/pdf/pdf.service';

@Controller('bordereaux-livraison')
@ApiTags("Bordereau de livraison")
@Roles(UserRole.Admin)
@UserTypes(TypeUtilisateur.TempoOne, TypeUtilisateur.Prestataire)
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
        @ApiBody({type: BordereauLivraisonCreateDto})
    save(@Body() dto: BordereauLivraisonCreateDto){
        return this.bordereauService.create(dto);
    }

        /**
         * LISTE LES BORDEREAUX DE LIVRAISON
         * @returns Liste des bordereaux de livraison
         */
    @Get()
    getAll(){
        return this.bordereauService.findAll()
    }
        
    /**
     * DETAIL D'UN BORDEREAUX DE LIVRAISON
     * @returns Un bordereaux de livraison
    */
    @Get("/:id")
    getById(@Param("id") id: string){
        return this.bordereauService.findById(id);
    }


    @Get('/:id/pdf')
    async getBonLivraison(@Param('id') id: string, @Res({ passthrough: false }) res: Response) {
        const bl = await this.bordereauService.findById(id);
        const fileName = id + "_" + new Date().toISOString();

        const pdfBuffer = await this.pdfService.generateBonLivraison(bl);
        res.setHeader('Content-Type', 'application/pdf');
        res.setHeader('Content-Disposition', `inline; filename="${fileName}.pdf"`);
        res.setHeader('Content-Length', pdfBuffer.length);
        
        res.end(pdfBuffer);
    }

    // @Get('/:id/code-bar')
    // async getCodeBarBonLivraison(@Param('id') id: string, @Res({ passthrough: false }) res: Response) {
    //     const bl = await this.bordereauService.findById(id);
    //     const fileName = id + "_" + new Date().toISOString();

    //     const pdfBuffer = BarcodeService.generateBarcodeImage(bl.id);
    //     res.setHeader('Content-Type', 'image/png');
    //     res.setHeader('Content-Disposition', `inline; filename="${fileName}.png"`);
    //     res.setHeader('Content-Length', pdfBuffer.length);
        
    //     res.end(pdfBuffer);
    // }
}
