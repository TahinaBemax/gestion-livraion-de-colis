import { Module } from '@nestjs/common';
import { CategorieLivreurModule } from './categorie-livreur/categorie-livreur.module';
import { LivreurService } from './livreur.service';

@Module({
  imports: [CategorieLivreurModule],
  providers: [LivreurService]
})
export class LivreurModule {}
