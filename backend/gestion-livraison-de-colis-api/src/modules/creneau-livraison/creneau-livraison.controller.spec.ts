import { Test, TestingModule } from '@nestjs/testing';
import { CreneauLivraisonController } from './creneau-livraison.controller';

describe('CreneauLivraisonController', () => {
  let controller: CreneauLivraisonController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CreneauLivraisonController],
    }).compile();

    controller = module.get<CreneauLivraisonController>(CreneauLivraisonController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
