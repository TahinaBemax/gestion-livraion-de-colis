import { Module } from '@nestjs/common';
import { CreneauLivraisonService } from './creneau-livraison.service';
import { CreneauLivraisonController } from './creneau-livraison.controller';

@Module({
  providers: [CreneauLivraisonService],
  controllers: [CreneauLivraisonController]
})
export class CreneauLivraisonModule {}
