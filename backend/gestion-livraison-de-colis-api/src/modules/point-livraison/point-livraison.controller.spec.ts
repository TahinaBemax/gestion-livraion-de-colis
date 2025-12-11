import { Test, TestingModule } from '@nestjs/testing';
import { PointLivraisonController } from './point-livraison.controller';

describe('PointLivraisonController', () => {
  let controller: PointLivraisonController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PointLivraisonController],
    }).compile();

    controller = module.get<PointLivraisonController>(PointLivraisonController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
