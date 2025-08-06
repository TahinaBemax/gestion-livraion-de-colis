import { Module } from '@nestjs/common';
import { ContrainteLivraisonService } from './contrainte-livraison.service';
import { ContrainteLivraisonController } from './contrainte-livraison.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PointLivraison } from '../point-livraison.entity';
import { ContrainteLivraison } from './contrainte-livraison.entity';

@Module({
  imports:[
    TypeOrmModule.forFeature([PointLivraison, ContrainteLivraison])
  ],
  providers: [ContrainteLivraisonService],
  controllers: [ContrainteLivraisonController],
  exports:[ContrainteLivraisonService]
})
export class ContrainteLivraisonModule {}
