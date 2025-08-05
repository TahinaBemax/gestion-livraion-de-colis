import { Test, TestingModule } from '@nestjs/testing';
import { ContrainteJourLivraisonController } from './contrainte-jour-livraison.controller';

describe('ContrainteJourLivraisonController', () => {
  let controller: ContrainteJourLivraisonController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ContrainteJourLivraisonController],
    }).compile();

    controller = module.get<ContrainteJourLivraisonController>(ContrainteJourLivraisonController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
