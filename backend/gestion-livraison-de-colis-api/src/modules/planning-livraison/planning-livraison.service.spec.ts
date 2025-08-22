import { Test, TestingModule } from '@nestjs/testing';
import { PlanningLivraisonService } from './planning-livraison.service';

describe('PlanningLivraisonService', () => {
  let service: PlanningLivraisonService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PlanningLivraisonService],
    }).compile();

    service = module.get<PlanningLivraisonService>(PlanningLivraisonService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
