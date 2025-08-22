import { Test, TestingModule } from '@nestjs/testing';
import { OrdreLivraisonController } from './ordre-livraison.controller';

describe('OrdreLivraisonController', () => {
  let controller: OrdreLivraisonController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [OrdreLivraisonController],
    }).compile();

    controller = module.get<OrdreLivraisonController>(OrdreLivraisonController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
