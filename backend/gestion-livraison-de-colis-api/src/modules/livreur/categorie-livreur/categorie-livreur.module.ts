import { Module } from '@nestjs/common';
import { CategorieLivreurService } from './categorie-livreur.service';
import { CategorieLivreur } from './categorie-livreur.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Livreur } from '../livreur.entity';

@Module({
  imports:[
    TypeOrmModule.forFeature([Livreur, CategorieLivreur])
  ],
  providers: [CategorieLivreurService, CategorieLivreur],
  exports:[CategorieLivreur, CategorieLivreurService]
})
export class CategorieLivreurModule {}
