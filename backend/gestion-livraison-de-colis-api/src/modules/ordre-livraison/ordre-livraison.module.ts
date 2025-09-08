import { forwardRef, Module } from '@nestjs/common';
import { OrdreLivraisonService } from './ordre-livraison.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OrdreLivraisonEntity } from './ordre-livraison.entity';
import { LivraisonEntity } from '../livraisons/livraison.entity';
import { TourneeLivraisonEntity } from '../tournee-livraison/tournee-livraison.entity';
import { PointLivraisonEntity } from '../point-livraison/point-livraison.entity';
import { LivraisonsModule } from '../livraisons/livraisons.module';
import { OrdreLivraisonController } from './ordre-livraison.controller';
import { ColisEntity } from '../colis/colis.entity';
import { NotificationModule } from '../notification/notification.module';
import { ColisModule } from '../colis/colis.module';

@Module({
  imports: [
    forwardRef(() => LivraisonsModule),
    forwardRef(() => NotificationModule),
    forwardRef(() => ColisModule),
    TypeOrmModule.forFeature([
      OrdreLivraisonEntity,
      LivraisonEntity,
      TourneeLivraisonEntity,
      PointLivraisonEntity,
      ColisEntity
    ])
  ],
  providers: [
    OrdreLivraisonService,
  ],
  exports: [
    OrdreLivraisonService
  ],
  controllers: [OrdreLivraisonController]
})
export class OrdreLivraisonModule {}
