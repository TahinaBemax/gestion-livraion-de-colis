import { Test, TestingModule } from '@nestjs/testing';
import { ContrainteLivraisonController } from './contrainte-livraison.controller';

describe('ContrainteLivraisonController', () => {
  let controller: ContrainteLivraisonController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ContrainteLivraisonController],
    }).compile();

    controller = module.get<ContrainteLivraisonController>(ContrainteLivraisonController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
