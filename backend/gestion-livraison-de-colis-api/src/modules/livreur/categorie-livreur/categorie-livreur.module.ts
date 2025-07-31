import { Module } from '@nestjs/common';
import { CategorieLivreurService } from './categorie-livreur.service';

@Module({
  providers: [CategorieLivreurService]
})
export class CategorieLivreurModule {}
