import { TypeOrmModule } from '@nestjs/typeorm';
import { Module } from '@nestjs/common';
import { LivraisonsController } from './livraisons.controller';
import { LivraisonsService } from './livraisons.service';
import { ColisEntity } from '../colis/colis.entity';
import { PointLivraisonEntity } from '../point-livraison/point-livraison.entity';
import { ProblemeLivraisonEntity } from './probleme-livraison.entity';
import { LivraisonEntity } from './livraison.entity';
import { OrdreLivraisonEntity } from '../ordre-livraison/ordre-livraison.entity';
import { BarcodeService } from 'src/core/code_barre/code_barre.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      LivraisonEntity,
      ColisEntity,
      PointLivraisonEntity,
      ProblemeLivraisonEntity,
      OrdreLivraisonEntity
    ]),
  ],
  controllers: [LivraisonsController],
  providers: [LivraisonsService, BarcodeService],
  exports: [LivraisonsService]
})
export class LivraisonsModule {}
