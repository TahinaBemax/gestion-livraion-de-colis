import { Test, TestingModule } from '@nestjs/testing';
import { ContrainteEvenementController } from './contrainte-evenement.controller';

describe('ContrainteEvenementController', () => {
  let controller: ContrainteEvenementController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ContrainteEvenementController],
    }).compile();

    controller = module.get<ContrainteEvenementController>(ContrainteEvenementController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
