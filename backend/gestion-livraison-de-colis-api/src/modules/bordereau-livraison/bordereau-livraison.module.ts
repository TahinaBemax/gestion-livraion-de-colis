import { Module } from '@nestjs/common';
import { BordereauLivraisonService } from './bordereau-livraison.service';
import { BordereauLivraisonEntity } from './bordereau-livraison.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Livreur } from '../livreur/livreur.entity';
import { DetailColisEntity } from '../colis/detail-colis.entity';
import { OrdreLivraisonEntity } from '../ordre-livraison/ordre-livraison.entity';
import { BordereauLivraisonController } from './bordereau-livraison.controller';
import { PdfService } from 'src/core/pdf/pdf.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      BordereauLivraisonEntity,
      OrdreLivraisonEntity,
      Livreur,
      DetailColisEntity
    ])
  ],
  providers: [BordereauLivraisonService, PdfService],
  controllers: [BordereauLivraisonController]
})
export class BordereauLivraisonModule {}
