import { Test, TestingModule } from '@nestjs/testing';
import { AnimationVilleService } from './animation-ville.service';

describe('AnimationVilleService', () => {
  let service: AnimationVilleService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AnimationVilleService],
    }).compile();

    service = module.get<AnimationVilleService>(AnimationVilleService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
