import { Module } from '@nestjs/common';
import { ContrainteJourService } from './contrainte-jour.service';
import { ContrainteJourController } from './contrainte-jour.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ContrainteJourEntity } from './contrainte-jour.entity';
import { ContrainteLivraisonEntity } from '../contrainte-livraison/contrainte-livraison.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      ContrainteJourEntity,
      ContrainteLivraisonEntity
    ])
  ],
  providers: [ContrainteJourService],
  controllers: [ContrainteJourController]
})
export class ContrainteJourModule {}
