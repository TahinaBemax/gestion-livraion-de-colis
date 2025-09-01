import { Module } from '@nestjs/common';
import { PlanningLivraisonService } from './planning-livraison.service';
import { PlanningLivraisonController } from './planning-livraison.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PlanningLivraisonEntity } from './planning-livraison.entity';
import { TourneeLivraisonEntity } from '../tournee-livraison/tournee-livraison.entity';
import { TourneeLivraisonModule } from '../tournee-livraison/tournee-livraison.module';

@Module({
  imports: [
    TourneeLivraisonModule,
    TypeOrmModule.forFeature([
      PlanningLivraisonEntity,
      TourneeLivraisonEntity,
    ])
  ],
  providers: [PlanningLivraisonService],
  controllers: [PlanningLivraisonController],
  exports: [PlanningLivraisonService]
})
export class PlanningLivraisonModule {}
