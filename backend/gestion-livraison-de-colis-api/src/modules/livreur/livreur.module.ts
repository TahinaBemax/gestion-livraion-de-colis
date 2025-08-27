import { forwardRef, Module } from '@nestjs/common';
import { CategorieLivreurModule } from './categorie-livreur/categorie-livreur.module';
import { LivreurService } from './livreur.service';
import { UserModule } from '../user/user.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../user/user.entity';
import { CategorieLivreur } from './categorie-livreur/categorie-livreur.entity';
import { Livreur } from './livreur.entity';
import { LiveurMapper } from './livreur.mapper';
import { LivreurTemporaireModule } from './livreur-temporaire/livreur-temporaire.module';
import { LivreurController } from './livreur.controller';
import { LivreurTemporaireService } from './livreur-temporaire/livreur-temporaire.service';
import { LivreurTemporaireEntity } from './livreur-temporaire/livreur-temporaire.entity';
import { Prestataire } from '../prestataire/prestataire.entity';
import { LivraisonsModule } from '../livraisons/livraisons.module';

@Module({
  imports: [
    CategorieLivreurModule, 
    forwardRef(() => UserModule),
    forwardRef(() => LivraisonsModule),
    TypeOrmModule.forFeature([
      Livreur, 
      User, 
      CategorieLivreur,
      LivreurTemporaireEntity,
      Prestataire
    ]),
    LivreurTemporaireModule
  ],
  providers: [
    LivreurService, 
    LiveurMapper,
    LivreurTemporaireService
  ],
  exports:[
    LivreurService, 
    LiveurMapper, 
  ],
  controllers: [LivreurController]
})
export class LivreurModule {}
