import { Test, TestingModule } from '@nestjs/testing';
import { CreneauLivraisonService } from './creneau-livraison.service';

describe('CreneauLivraisonService', () => {
  let service: CreneauLivraisonService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CreneauLivraisonService],
    }).compile();

    service = module.get<CreneauLivraisonService>(CreneauLivraisonService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
