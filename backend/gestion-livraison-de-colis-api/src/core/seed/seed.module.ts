import { Module } from '@nestjs/common';
import { SeedService } from './seed.service';
import { UserModule } from 'src/modules/user/user.module';
import { BordereauLivraisonModule } from 'src/modules/bordereau-livraison/bordereau-livraison.module';
import { ColisModule } from 'src/modules/colis/colis.module';
import { LivraisonsModule } from 'src/modules/livraisons/livraisons.module';
import { LivreurModule } from 'src/modules/livreur/livreur.module';
import { PlanningLivraisonModule } from 'src/modules/planning-livraison/planning-livraison.module';
import { PointLivraisonModule } from 'src/modules/point-livraison/point-livraison.module';
import { PrestataireModule } from 'src/modules/prestataire/prestataire.module';
import { TourneeLivraisonModule } from 'src/modules/tournee-livraison/tournee-livraison.module';

@Module({
    imports:[
      UserModule,
      PrestataireModule,
      LivreurModule,
      PointLivraisonModule,
      LivraisonsModule,
      ColisModule,
      PlanningLivraisonModule,
      TourneeLivraisonModule,
      BordereauLivraisonModule,
    ],
    providers: [
        SeedService,
    ],
})
export class SeedModule {
}
