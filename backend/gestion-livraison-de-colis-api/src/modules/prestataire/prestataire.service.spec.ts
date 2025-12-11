import { Test, TestingModule } from '@nestjs/testing';
import { PrestataireService } from './prestataire.service';

describe('PrestataireService', () => {
  let service: PrestataireService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PrestataireService],
    }).compile();

    service = module.get<PrestataireService>(PrestataireService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
