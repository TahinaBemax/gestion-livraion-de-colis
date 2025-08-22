import { OrdreLivraisonService } from './../ordre-livraison/ordre-livraison.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Module } from '@nestjs/common';
import { TourneeLivraisonService } from './tournee-livraison.service';
import { TourneeLivraisonController } from './tournee-livraison.controller';
import { TourneeLivraisonEntity } from './tournee-livraison.entity';
import { PlanningLivraisonEntity } from '../planning-livraison/planning-livraison.entity';
import { OrdreLivraisonEntity } from '../ordre-livraison/ordre-livraison.entity';
import { Livreur } from '../livreur/livreur.entity';
import { OrdreLivraisonModule } from '../ordre-livraison/ordre-livraison.module';

@Module({
  imports: [
    OrdreLivraisonModule, 
    TypeOrmModule.forFeature([
      TourneeLivraisonEntity,
      PlanningLivraisonEntity,
      OrdreLivraisonEntity,
      Livreur
    ])
  ],
  providers: [
    TourneeLivraisonService
  ],
  controllers: [TourneeLivraisonController],
  exports:[TourneeLivraisonService]
})
export class TourneeLivraisonModule {}
