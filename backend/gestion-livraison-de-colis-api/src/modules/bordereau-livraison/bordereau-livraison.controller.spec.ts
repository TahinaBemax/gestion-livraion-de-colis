import { Test, TestingModule } from '@nestjs/testing';
import { BordereauLivraisonController } from './bordereau-livraison.controller';

describe('BordereauLivraisonController', () => {
  let controller: BordereauLivraisonController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [BordereauLivraisonController],
    }).compile();

    controller = module.get<BordereauLivraisonController>(BordereauLivraisonController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
