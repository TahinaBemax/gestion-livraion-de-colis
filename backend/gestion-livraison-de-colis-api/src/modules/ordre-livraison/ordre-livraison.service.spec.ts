import { Test, TestingModule } from '@nestjs/testing';
import { OrdreLivraisonService } from './ordre-livraison.service';

describe('OrdreLivraisonService', () => {
  let service: OrdreLivraisonService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [OrdreLivraisonService],
    }).compile();

    service = module.get<OrdreLivraisonService>(OrdreLivraisonService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
