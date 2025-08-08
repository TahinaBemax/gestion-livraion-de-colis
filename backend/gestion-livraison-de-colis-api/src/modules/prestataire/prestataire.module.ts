import { User } from './../user/user.entity';
import { forwardRef, Module } from '@nestjs/common';
import { PrestataireService } from './prestataire.service';
import { PrestataireController } from './prestataire.controller';
import { Prestataire } from './prestataire.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LivreurModule } from '../livreur/livreur.module';
import { UserModule } from '../user/user.module';
import { PointLivraisonService } from '../point-livraison/point-livraison.service';
import { PointLivraisonModule } from '../point-livraison/point-livraison.module';
import { PointLivraison } from '../point-livraison/point-livraison.entity';
import { ContrainteLivraisonService } from '../point-livraison/contrainte-livraison/contrainte-livraison.service';
import { AnimationVilleService } from '../point-livraison/animation-ville/animation-ville.service';
import { ContrainteLivraison } from '../point-livraison/contrainte-livraison/contrainte-livraison.entity';
import { AnimationVille } from '../point-livraison/animation-ville/animation-ville.entity';

@Module({
  providers: [
    PrestataireService, 
    PointLivraisonService,
    ContrainteLivraisonService,
    AnimationVilleService
  ],
  controllers: [PrestataireController],
  exports:[PrestataireService],
  imports: [
    forwardRef(() => PointLivraisonModule),
    UserModule,
    LivreurModule,
    TypeOrmModule.forFeature([
      Prestataire, 
      User, 
      PointLivraison, 
      ContrainteLivraison, 
      AnimationVille
    ])
  ],
})
export class PrestataireModule {}
