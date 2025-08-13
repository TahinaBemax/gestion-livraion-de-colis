import { Test, TestingModule } from '@nestjs/testing';
import { ContrainteJourController } from './contrainte-jour.controller';

describe('ContrainteJourController', () => {
  let controller: ContrainteJourController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ContrainteJourController],
    }).compile();

    controller = module.get<ContrainteJourController>(ContrainteJourController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
