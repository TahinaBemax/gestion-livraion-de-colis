import { Test, TestingModule } from '@nestjs/testing';
import { PointLivraisonService } from './point-livraison.service';

describe('PointLivraisonService', () => {
  let service: PointLivraisonService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PointLivraisonService],
    }).compile();

    service = module.get<PointLivraisonService>(PointLivraisonService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
