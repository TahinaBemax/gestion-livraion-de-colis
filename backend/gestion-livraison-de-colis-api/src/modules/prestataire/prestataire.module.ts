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
import { OrdreLivraisonModule } from '../ordre-livraison/ordre-livraison.module';
import { NotificationModule } from '../notification/notification.module';

@Module({
  providers: [
    PrestataireService
  ],
  controllers: [PrestataireController],
  exports:[PrestataireService],
  imports: [
    forwardRef(() => PointLivraisonModule),
    forwardRef(() => OrdreLivraisonModule),
    forwardRef(() => NotificationModule),
    forwardRef(() => ContrainteLivraisonModule),
    forwardRef(() => UserModule),
    forwardRef(() => LivreurModule),
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
