import { forwardRef, Module } from '@nestjs/common';
import { ContrainteLivraisonModule } from './contrainte-livraison/contrainte-livraison.module';
import { ContrainteJourLivraisonModule } from './contrainte-jour-livraison/contrainte-jour-livraison.module';
import { AnimationVilleModule } from './animation-ville/animation-ville.module';
import { PointLivraisonService } from './point-livraison.service';
import { PointLivraisonController } from './point-livraison.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Prestataire } from '../prestataire/prestataire.entity';
import { AnimationVille } from './animation-ville/animation-ville.entity';
import { ContrainteLivraison } from './contrainte-livraison/contrainte-livraison.entity';
import { PointLivraison } from './point-livraison.entity';
import { PrestataireModule } from '../prestataire/prestataire.module';
import { PrestataireService } from '../prestataire/prestataire.service';
import { ContrainteJourLivraisonService } from './contrainte-jour-livraison/contrainte-jour-livraison.service';
import { AnimationVilleService } from './animation-ville/animation-ville.service';
import { ContrainteLivraisonService } from './contrainte-livraison/contrainte-livraison.service';

@Module({
  imports: [
    ContrainteLivraisonModule, 
    ContrainteJourLivraisonModule,
    PrestataireModule,
    forwardRef(() => AnimationVilleModule),
    TypeOrmModule.forFeature([Prestataire, ContrainteLivraison, AnimationVille, PointLivraison])
  ],
  providers: [
    PointLivraisonService, 
    PrestataireService, 
    ContrainteLivraisonService,
    AnimationVilleService
  ],
  controllers: [PointLivraisonController],
  exports:[PointLivraisonModule]
})
export class PointLivraisonModule {}
