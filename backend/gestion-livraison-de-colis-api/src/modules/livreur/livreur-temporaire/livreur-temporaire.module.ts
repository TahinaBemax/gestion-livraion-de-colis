import { Module } from '@nestjs/common';
import { LivreurTemporaireService } from './livreur-temporaire.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LivreurTemporaireEntity } from './livreur-temporaire.entity';
import { Livreur } from '../livreur.entity';
import { User } from 'src/modules/user/user.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      LivreurTemporaireEntity,
      Livreur,
      User
    ])
  ],
  providers: [LivreurTemporaireService],
  exports:[LivreurTemporaireService]
})
export class LivreurTemporaireModule {}
