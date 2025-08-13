import { User } from './../user/user.entity';
import { forwardRef, Module } from '@nestjs/common';
import { PrestataireService } from './prestataire.service';
import { PrestataireController } from './prestataire.controller';
import { Prestataire } from './prestataire.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LivreurModule } from '../livreur/livreur.module';
import { UserModule } from '../user/user.module';
import { PointLivraisonModule } from '../point-livraison/point-livraison.module';
import { PointLivraisonEntity } from '../point-livraison/point-livraison.entity';
import { ContrainteLivraisonEntity } from '../contrainte-livraison/contrainte-livraison.entity';
import { EvenementLocalEntity } from '../evenement-local/evenement-local.entity';
import { ContrainteLivraisonModule } from '../contrainte-livraison/contrainte-livraison.module';

@Module({
  providers: [
    PrestataireService
  ],
  controllers: [PrestataireController],
  exports:[PrestataireService],
  imports: [
    forwardRef(() => PointLivraisonModule),
    ContrainteLivraisonModule,
    UserModule,
    LivreurModule,
    TypeOrmModule.forFeature([
      Prestataire, 
      User, 
      PointLivraisonEntity, 
      ContrainteLivraisonEntity, 
      EvenementLocalEntity
    ])
  ],
})
export class PrestataireModule {}
