import { AnimationVilleService } from './../point-livraison/animation-ville/animation-ville.service';
import { Module } from '@nestjs/common';
import { CsvImportService } from './csv-import.service';
import { CsvImportController } from './csv-import.controller';
import { MulterModule } from '@nestjs/platform-express';
import { PointLivraisonService } from '../point-livraison/point-livraison.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PointLivraison } from '../point-livraison/point-livraison.entity';
import { AnimationVille } from '../point-livraison/animation-ville/animation-ville.entity';
import { ContrainteLivraison } from '../point-livraison/contrainte-livraison/contrainte-livraison.entity';
import { PrestataireService } from '../prestataire/prestataire.service';
import { Prestataire } from '../prestataire/prestataire.entity';
import { ContrainteJourLivraisonService } from '../point-livraison/contrainte-jour-livraison/contrainte-jour-livraison.service';
import { ContrainteLivraisonService } from '../point-livraison/contrainte-livraison/contrainte-livraison.service';
import { User } from '../user/user.entity';

@Module({
  imports: [
    MulterModule.register({
      dest: "./uploads"
    }),
    TypeOrmModule.forFeature([
      PointLivraison,
      AnimationVille, 
      ContrainteLivraison, 
      ContrainteLivraison, 
      Prestataire,
      User
    ])
  ],
  providers: [
    CsvImportService, 
    PointLivraisonService,
    PrestataireService,
    ContrainteJourLivraisonService,
    AnimationVilleService,
    ContrainteLivraisonService,
  ],
  controllers: [CsvImportController]
})
export class CsvImportModule {}
