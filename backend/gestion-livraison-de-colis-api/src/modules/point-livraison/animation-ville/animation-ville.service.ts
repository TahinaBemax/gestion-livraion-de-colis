import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AnimationVille } from './animation-ville.entity';

@Injectable()
export class AnimationVilleService {
    constructor(
        @InjectRepository(AnimationVille)
        private readonly animationVilleRep: Repository<AnimationVille>
    ){}

    async findById(id:number):Promise<AnimationVille> {
        return this.animationVilleRep.findOneOrFail({
            where: {id_animation_ville: id}
        });
    }
}
