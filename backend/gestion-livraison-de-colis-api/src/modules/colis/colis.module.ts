import { TypeOrmModule } from '@nestjs/typeorm';
import { forwardRef, Module } from '@nestjs/common';
import { ColisController } from './colis.controller';
import { ColisService } from './colis.service';
import { ColisEntity } from './colis.entity';
import { DetailColisEntity } from './detail-colis.entity';
import { ProblemeColisEntity } from './probleme-colis.entity';
import { LivraisonEntity } from '../livraisons/livraison.entity';
import { LivreurModule } from '../livreur/livreur.module';
import { LivraisonsModule } from '../livraisons/livraisons.module';

@Module({
  imports: [
    forwardRef(() => LivreurModule),
    forwardRef(() => LivraisonsModule),
    TypeOrmModule.forFeature([
      ColisEntity,
      DetailColisEntity,
      ProblemeColisEntity,
      LivraisonEntity
    ])
  ],
  controllers: [ColisController],
  providers: [ColisService],
  exports: [ColisService]
})
export class ColisModule {}
