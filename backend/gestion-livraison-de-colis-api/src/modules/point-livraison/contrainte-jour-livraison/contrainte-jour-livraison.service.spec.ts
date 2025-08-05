import { Test, TestingModule } from '@nestjs/testing';
import { ContrainteJourLivraisonService } from './contrainte-jour-livraison.service';

describe('ContrainteJourLivraisonService', () => {
  let service: ContrainteJourLivraisonService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ContrainteJourLivraisonService],
    }).compile();

    service = module.get<ContrainteJourLivraisonService>(ContrainteJourLivraisonService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
