import { Test, TestingModule } from '@nestjs/testing';
import { AnimationVilleController } from './animation-ville.controller';

describe('AnimationVilleController', () => {
  let controller: AnimationVilleController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AnimationVilleController],
    }).compile();

    controller = module.get<AnimationVilleController>(AnimationVilleController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
