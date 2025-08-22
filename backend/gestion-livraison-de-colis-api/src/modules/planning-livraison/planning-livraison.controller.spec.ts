import { Test, TestingModule } from '@nestjs/testing';
import { PlanningLivraisonController } from './planning-livraison.controller';

describe('PlanningLivraisonController', () => {
  let controller: PlanningLivraisonController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PlanningLivraisonController],
    }).compile();

    controller = module.get<PlanningLivraisonController>(PlanningLivraisonController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
