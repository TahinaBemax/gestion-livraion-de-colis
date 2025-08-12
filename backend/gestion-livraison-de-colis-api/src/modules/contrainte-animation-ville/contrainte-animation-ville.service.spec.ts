import { Test, TestingModule } from '@nestjs/testing';
import { ContrainteAnimationVilleService } from './contrainte-animation-ville.service';

describe('ContrainteAnimationVilleService', () => {
  let service: ContrainteAnimationVilleService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ContrainteAnimationVilleService],
    }).compile();

    service = module.get<ContrainteAnimationVilleService>(ContrainteAnimationVilleService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
