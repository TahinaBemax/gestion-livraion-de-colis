import { Test, TestingModule } from '@nestjs/testing';
import { BordereauLivraisonService } from './bordereau-livraison.service';

describe('BordereauLivraisonService', () => {
  let service: BordereauLivraisonService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [BordereauLivraisonService],
    }).compile();

    service = module.get<BordereauLivraisonService>(BordereauLivraisonService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
