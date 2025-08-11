import { Module } from '@nestjs/common';
import { ContrainteJourLivraisonService } from './contrainte-jour-livraison.service';
import { ContrainteJourLivraisonController } from './contrainte-jour-livraison.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ContrainteLivraison } from '../contrainte-livraison/contrainte-livraison.entity';
import { ContrainteLivraisonModule } from '../contrainte-livraison/contrainte-livraison.module';
import { ContrainteJourLivraison } from './contrainte-jour-livraison.entity';

@Module({
  imports: [
      ContrainteLivraisonModule, 
      TypeOrmModule.forFeature([ContrainteLivraison, ContrainteJourLivraison])
  ],
  providers: [ContrainteJourLivraisonService],
  controllers: [ContrainteJourLivraisonController],
  exports:[ContrainteJourLivraisonService]
})
export class ContrainteJourLivraisonModule {}
