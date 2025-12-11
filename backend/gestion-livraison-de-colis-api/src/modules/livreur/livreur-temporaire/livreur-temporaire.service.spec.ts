import { Test, TestingModule } from '@nestjs/testing';
import { LivreurTemporaireService } from './livreur-temporaire.service';

describe('LivreurTemporaireService', () => {
  let service: LivreurTemporaireService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [LivreurTemporaireService],
    }).compile();

    service = module.get<LivreurTemporaireService>(LivreurTemporaireService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
