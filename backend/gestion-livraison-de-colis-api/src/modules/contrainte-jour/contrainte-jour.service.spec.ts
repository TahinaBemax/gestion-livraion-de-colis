import { Test, TestingModule } from '@nestjs/testing';
import { ContrainteJourService } from './contrainte-jour.service';

describe('ContrainteJourService', () => {
  let service: ContrainteJourService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ContrainteJourService],
    }).compile();

    service = module.get<ContrainteJourService>(ContrainteJourService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
