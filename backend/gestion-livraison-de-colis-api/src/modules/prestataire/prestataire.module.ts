import { Module } from '@nestjs/common';
import { PrestataireService } from './prestataire.service';
import { PrestataireController } from './prestataire.controller';
import { Prestataire } from './prestataire.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../user/user.entity';
import { LivreurModule } from '../livreur/livreur.module';

@Module({
  providers: [PrestataireService, Prestataire],
  controllers: [PrestataireController],
  exports:[Prestataire, PrestataireService],
  imports: [
    LivreurModule,
    TypeOrmModule.forFeature([Prestataire, User])
  ],
})
export class PrestataireModule {}
