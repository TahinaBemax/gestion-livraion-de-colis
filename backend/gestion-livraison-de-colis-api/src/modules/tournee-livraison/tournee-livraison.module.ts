import { LivreurModule } from 'src/modules/livreur/livreur.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { forwardRef, Module } from '@nestjs/common';
import { TourneeLivraisonService } from './tournee-livraison.service';
import { TourneeLivraisonController } from './tournee-livraison.controller';
import { TourneeLivraisonEntity } from './tournee-livraison.entity';
import { OrdreLivraisonEntity } from '../ordre-livraison/ordre-livraison.entity';
import { OrdreLivraisonModule } from '../ordre-livraison/ordre-livraison.module';
import { Prestataire } from '../prestataire/prestataire.entity';
import { LivraisonsModule } from '../livraisons/livraisons.module';

@Module({
  imports: [
    forwardRef(() => LivreurModule),
    forwardRef(() => OrdreLivraisonModule),
    forwardRef(() => LivraisonsModule),
    TypeOrmModule.forFeature([
      TourneeLivraisonEntity,
      OrdreLivraisonEntity,
      Prestataire
    ])
  ],
  providers: [
    TourneeLivraisonService,
  ],
  controllers: [TourneeLivraisonController],
  exports:[TourneeLivraisonService]
})
export class TourneeLivraisonModule {}
