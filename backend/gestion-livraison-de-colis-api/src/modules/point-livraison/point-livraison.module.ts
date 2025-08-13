import { forwardRef, Module } from '@nestjs/common';
import { PointLivraisonController } from './point-livraison.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Prestataire } from '../prestataire/prestataire.entity';
import { PrestataireModule } from '../prestataire/prestataire.module';
import { PrestataireService } from '../prestataire/prestataire.service';
import { User } from '../user/user.entity';
import { PointLivraisonService } from './point-livraison.service';
import { ContrainteEvenementEntity } from '../contrainte-evenement/contrainte-evenement.entity';
import { ContrainteLivraisonEntity } from '../contrainte-livraison/contrainte-livraison.entity';
import { ContrainteLivraisonModule } from '../contrainte-livraison/contrainte-livraison.module';
import { EvenementLocalModule } from '../evenement-local/evenement-local.module';
import { ContrainteJourModule } from '../contrainte-jour/contrainte-jour.module';
import { PointLivraisonEntity } from './point-livraison.entity';
import { EvenementLocalEntity } from '../evenement-local/evenement-local.entity';
import { EvenementLocalService } from '../evenement-local/evenement-local.service';

@Module({
  imports: [
    forwardRef(() => ContrainteLivraisonModule), 
    ContrainteJourModule,
    forwardRef(() => PrestataireModule),
    forwardRef(() => EvenementLocalModule),
    TypeOrmModule.forFeature([
      PointLivraisonEntity,
      Prestataire, 
      User,
      EvenementLocalEntity,
      ContrainteEvenementEntity,
      ContrainteLivraisonEntity,
    ])
  ],
  providers: [
    PointLivraisonService,
    PrestataireService,
    EvenementLocalService
  ],
  controllers: [PointLivraisonController],
  exports:[PointLivraisonService]
})
export class PointLivraisonModule {}
