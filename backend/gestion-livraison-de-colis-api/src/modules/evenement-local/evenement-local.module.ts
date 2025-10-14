import { forwardRef, Module } from '@nestjs/common';
import { EvenementLocalService } from './evenement-local.service';
import { EvenementLocalController } from './evenement-local.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PointLivraisonModule } from '../point-livraison/point-livraison.module';
import { PointLivraisonEntity } from '../point-livraison/point-livraison.entity';
import { ContrainteEvenementEntity } from '../contrainte-evenement/contrainte-evenement.entity';
import { EvenementLocalEntity } from './evenement-local.entity';

@Module({
  imports: [
    forwardRef(() => PointLivraisonModule), 
    TypeOrmModule.forFeature([
      EvenementLocalEntity,
      PointLivraisonEntity, 
      ContrainteEvenementEntity,
    ])
  ],
  providers: [EvenementLocalService],
  controllers: [EvenementLocalController],
  exports: [EvenementLocalService]
})
export class EvenementLocalModule {}
