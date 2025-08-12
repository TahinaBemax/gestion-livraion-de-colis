import { forwardRef, Module } from '@nestjs/common';
import { ContrainteLivraisonModule } from './contrainte-livraison/contrainte-livraison.module';
import { ContrainteJourLivraisonModule } from './contrainte-jour-livraison/contrainte-jour-livraison.module';
import { AnimationVilleModule } from './animation-ville/animation-ville.module';
import { PointLivraisonController } from './point-livraison.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Prestataire } from '../prestataire/prestataire.entity';
import { AnimationVille } from './animation-ville/animation-ville.entity';
import { ContrainteLivraison } from './contrainte-livraison/contrainte-livraison.entity';
import { PointLivraison } from './point-livraison.entity';
import { PrestataireModule } from '../prestataire/prestataire.module';
import { PrestataireService } from '../prestataire/prestataire.service';
import { AnimationVilleService } from './animation-ville/animation-ville.service';
import { User } from '../user/user.entity';
import { PointLivraisonService } from './point-livraison.service';
import { ContrainteAnimationVille } from '../contrainte-animation-ville/contrainte-animation-ville.entity';

@Module({
  imports: [
    forwardRef(() => ContrainteLivraisonModule), 
    ContrainteJourLivraisonModule,
    forwardRef(() => PrestataireModule),
    forwardRef(() => AnimationVilleModule),
    TypeOrmModule.forFeature([
      Prestataire, 
      User,
      ContrainteLivraison,
      AnimationVille,
      PointLivraison,
      ContrainteAnimationVille
    ])
  ],
  providers: [
    PointLivraisonService,
    PrestataireService,
    AnimationVilleService
  ],
  controllers: [PointLivraisonController],
  exports:[PointLivraisonService]
})
export class PointLivraisonModule {}
