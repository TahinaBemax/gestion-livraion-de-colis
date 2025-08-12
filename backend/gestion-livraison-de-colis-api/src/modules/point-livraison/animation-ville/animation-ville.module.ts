import { forwardRef, Module } from '@nestjs/common';
import { AnimationVilleService } from './animation-ville.service';
import { AnimationVilleController } from './animation-ville.controller';
import { PointLivraison } from '../point-livraison.entity';
import { PointLivraisonModule } from '../point-livraison.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AnimationVille } from './animation-ville.entity';
import { ContrainteAnimationVille } from 'src/modules/contrainte-animation-ville/contrainte-animation-ville.entity';

@Module({
  imports: [
    forwardRef(() => PointLivraisonModule), 
    TypeOrmModule.forFeature([PointLivraison, AnimationVille, ContrainteAnimationVille])
  ],
  providers: [AnimationVilleService],
  controllers: [AnimationVilleController],
  exports:[AnimationVilleService]
})
export class AnimationVilleModule {}
