import { Test, TestingModule } from '@nestjs/testing';
import { TourneeLivraisonController } from './tournee-livraison.controller';

describe('TourneeLivraisonController', () => {
  let controller: TourneeLivraisonController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TourneeLivraisonController],
    }).compile();

    controller = module.get<TourneeLivraisonController>(TourneeLivraisonController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
