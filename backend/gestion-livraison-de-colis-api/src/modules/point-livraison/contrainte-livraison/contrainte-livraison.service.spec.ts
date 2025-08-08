import { Test, TestingModule } from '@nestjs/testing';
import { ContrainteLivraisonService } from './contrainte-livraison.service';

describe('ContrainteLivraisonService', () => {
  let service: ContrainteLivraisonService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ContrainteLivraisonService],
    }).compile();

    service = module.get<ContrainteLivraisonService>(ContrainteLivraisonService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
