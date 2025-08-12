import { forwardRef, Module } from '@nestjs/common';
import { ContrainteLivraisonService } from './contrainte-livraison.service';
import { ContrainteLivraisonController } from './contrainte-livraison.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PointLivraison } from '../point-livraison.entity';
import { ContrainteLivraison } from './contrainte-livraison.entity';
import { Prestataire } from 'src/modules/prestataire/prestataire.entity';
import { AnimationVille } from '../animation-ville/animation-ville.entity';
import { ContrainteJourLivraison } from '../contrainte-jour-livraison/contrainte-jour-livraison.entity';
import { ContrainteJourLivraisonService } from '../contrainte-jour-livraison/contrainte-jour-livraison.service';
import { PrestataireService } from 'src/modules/prestataire/prestataire.service';
import { AnimationVilleService } from '../animation-ville/animation-ville.service';
import { User } from 'src/modules/user/user.entity';
import { PointLivraisonModule } from '../point-livraison.module';
import { ContrainteAnimationVille } from 'src/modules/contrainte-animation-ville/contrainte-animation-ville.entity';

@Module({
  imports:[
    forwardRef(() => PointLivraisonModule),
    TypeOrmModule.forFeature([
      ContrainteLivraison, 
      ContrainteJourLivraison,
      Prestataire, 
      AnimationVille, 
      User,
      PointLivraison, 
      ContrainteAnimationVille
    ])
  ],
  providers: [
    ContrainteLivraisonService,
    ContrainteJourLivraisonService,
    PrestataireService,
    AnimationVilleService
  ],
  controllers: [ContrainteLivraisonController],
  exports:[ContrainteLivraisonService]
})
export class ContrainteLivraisonModule {}
