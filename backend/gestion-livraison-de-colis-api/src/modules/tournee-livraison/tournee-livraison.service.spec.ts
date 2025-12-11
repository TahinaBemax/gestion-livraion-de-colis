import { Test, TestingModule } from '@nestjs/testing';
import { TourneeLivraisonService } from './tournee-livraison.service';

describe('TourneeLivraisonService', () => {
  let service: TourneeLivraisonService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [TourneeLivraisonService],
    }).compile();

    service = module.get<TourneeLivraisonService>(TourneeLivraisonService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
