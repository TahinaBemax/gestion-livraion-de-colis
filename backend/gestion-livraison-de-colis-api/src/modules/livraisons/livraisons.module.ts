import { TypeOrmModule } from '@nestjs/typeorm';
import { Module } from '@nestjs/common';
import { LivraisonsController } from './livraisons.controller';
import { LivraisonsService } from './livraisons.service';
import { ColisEntity } from '../colis/colis.entity';
import { PointLivraisonEntity } from '../point-livraison/point-livraison.entity';
import { ProblemeLivraisonEntity } from './probleme-livraison.entity';
import { LivraisonEntity } from './livraison.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      LivraisonEntity,
      ColisEntity,
      PointLivraisonEntity,
      ProblemeLivraisonEntity,
    ]),
  ],
  controllers: [LivraisonsController],
  providers: [LivraisonsService],
  exports: [LivraisonsService]
})
export class LivraisonsModule {}
