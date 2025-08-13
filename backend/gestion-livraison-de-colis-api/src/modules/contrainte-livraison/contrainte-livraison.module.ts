import { forwardRef, Module } from '@nestjs/common';
import { ContrainteLivraisonService } from './contrainte-livraison.service';
import { ContrainteLivraisonController } from './contrainte-livraison.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PointLivraisonModule } from '../point-livraison/point-livraison.module';
import { Prestataire } from '../prestataire/prestataire.entity';
import { PrestataireService } from '../prestataire/prestataire.service';
import { User } from '../user/user.entity';
import { PointLivraisonEntity } from '../point-livraison/point-livraison.entity';
import { ContrainteLivraisonEntity } from './contrainte-livraison.entity';
import { ContrainteJourEntity } from '../contrainte-jour/contrainte-jour.entity';
import { EvenementLocalEntity } from '../evenement-local/evenement-local.entity';
import { EvenementLocalService } from '../evenement-local/evenement-local.service';
import { ContrainteJourService } from '../contrainte-jour/contrainte-jour.service';
import { ContrainteEvenementEntity } from '../contrainte-evenement/contrainte-evenement.entity';

@Module({
  imports:[
    forwardRef(() => PointLivraisonModule),
    TypeOrmModule.forFeature([
      ContrainteLivraisonEntity, 
      ContrainteJourEntity,
      Prestataire, 
      EvenementLocalEntity, 
      User,
      PointLivraisonEntity, 
      ContrainteEvenementEntity
    ])
  ],
  providers: [
    ContrainteLivraisonService,
    ContrainteJourService,
    PrestataireService,
    EvenementLocalService
  ],
  controllers: [ContrainteLivraisonController],
  exports:[ContrainteLivraisonService]
})
export class ContrainteLivraisonModule {

}
