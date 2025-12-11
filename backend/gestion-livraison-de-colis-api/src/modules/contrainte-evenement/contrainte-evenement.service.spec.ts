import { Test, TestingModule } from '@nestjs/testing';
import { ContrainteEvenementService } from './contrainte-evenement.service';

describe('ContrainteEvenementService', () => {
  let service: ContrainteEvenementService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ContrainteEvenementService],
    }).compile();

    service = module.get<ContrainteEvenementService>(ContrainteEvenementService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
