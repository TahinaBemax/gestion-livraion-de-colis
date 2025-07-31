import { Module } from '@nestjs/common';
import { CategorieLivreurService } from './categorie-livreur.service';
import { CategorieLivreur } from './categorie-livreur.entity';

@Module({
  providers: [CategorieLivreurService],
  exports:[CategorieLivreur, CategorieLivreurService]
})
export class CategorieLivreurModule {}
