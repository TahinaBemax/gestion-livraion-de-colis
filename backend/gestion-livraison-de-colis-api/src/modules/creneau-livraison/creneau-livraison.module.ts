import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CreneauLivraisonService } from './creneau-livraison.service';
import { CreneauLivraisonController } from './creneau-livraison.controller';
import { CreneauLivraisonEntity } from './creneau-livraison.entity';

@Module({
  imports: [TypeOrmModule.forFeature([CreneauLivraisonEntity])],
  providers: [CreneauLivraisonService],
  controllers: [CreneauLivraisonController],
  exports: [CreneauLivraisonService]
})
export class CreneauLivraisonModule {}
