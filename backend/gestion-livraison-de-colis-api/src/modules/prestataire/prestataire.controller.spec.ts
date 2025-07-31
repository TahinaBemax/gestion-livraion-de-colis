import { Test, TestingModule } from '@nestjs/testing';
import { PrestataireController } from './prestataire.controller';

describe('PrestataireController', () => {
  let controller: PrestataireController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PrestataireController],
    }).compile();

    controller = module.get<PrestataireController>(PrestataireController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
