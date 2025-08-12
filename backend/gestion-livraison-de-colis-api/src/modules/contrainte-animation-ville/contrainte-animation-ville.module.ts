import { Module } from '@nestjs/common';
import { ContrainteAnimationVilleService } from './contrainte-animation-ville.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ContrainteAnimationVille } from './contrainte-animation-ville.entity';
import { AnimationVille } from '../point-livraison/animation-ville/animation-ville.entity';
import { PointLivraison } from '../point-livraison/point-livraison.entity';

@Module({
  imports:[
    TypeOrmModule.forFeature([
      ContrainteAnimationVille, 
      AnimationVille, 
      PointLivraison
    ])
  ],
  providers: [ContrainteAnimationVilleService],
  exports: [ContrainteAnimationVilleService]
})
export class ContrainteAnimationVilleModule {}
