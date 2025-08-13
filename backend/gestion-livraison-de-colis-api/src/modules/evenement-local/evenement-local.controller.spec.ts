import { Test, TestingModule } from '@nestjs/testing';
import { EvenementLocalController } from './evenement-local.controller';

describe('EvenementLocalController', () => {
  let controller: EvenementLocalController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [EvenementLocalController],
    }).compile();

    controller = module.get<EvenementLocalController>(EvenementLocalController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
