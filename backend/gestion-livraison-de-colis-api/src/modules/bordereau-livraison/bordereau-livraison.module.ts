import { Module } from '@nestjs/common';
import { BordereauLivraisonService } from './bordereau-livraison.service';
import { BordereauLivraisonEntity } from './bordereau-livraison.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Livreur } from '../livreur/livreur.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      BordereauLivraisonEntity,
      Livreur
    ])
  ],
  providers: [BordereauLivraisonService]
})
export class BordereauLivraisonModule {}
