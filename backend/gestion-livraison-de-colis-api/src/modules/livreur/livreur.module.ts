import { Module } from '@nestjs/common';
import { CategorieLivreurModule } from './categorie-livreur/categorie-livreur.module';
import { LivreurService } from './livreur.service';
import { UserModule } from '../user/user.module';

@Module({
  imports: [CategorieLivreurModule, UserModule],
  providers: [LivreurService],
  exports:[LivreurModule]
})
export class LivreurModule {}
