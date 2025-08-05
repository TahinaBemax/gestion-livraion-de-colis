import { forwardRef, Module } from '@nestjs/common';
import { CategorieLivreurModule } from './categorie-livreur/categorie-livreur.module';
import { LivreurService } from './livreur.service';
import { UserModule } from '../user/user.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../user/user.entity';
import { CategorieLivreur } from './categorie-livreur/categorie-livreur.entity';
import { Livreur } from './livreur.entity';
import { LiveurMapper } from './livreur.mapper';

@Module({
  imports: [
    CategorieLivreurModule, 
    forwardRef(() => UserModule),
    TypeOrmModule.forFeature([Livreur, User, CategorieLivreur])
  ],
  providers: [LivreurService, LiveurMapper],
  exports:[LivreurService, LiveurMapper]
})
export class LivreurModule {}
