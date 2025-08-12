import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ContrainteAnimationVille } from './contrainte-animation-ville.entity';

@Injectable()
export class ContrainteAnimationVilleService {
    constructor(
        @InjectRepository(ContrainteAnimationVille)
        repository: Repository<ContrainteAnimationVille>
    ){}

}
