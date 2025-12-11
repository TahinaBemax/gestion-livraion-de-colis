import { Test, TestingModule } from '@nestjs/testing';
import { ColisService } from './colis.service';

describe('ColisService', () => {
  let service: ColisService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ColisService],
    }).compile();

    service = module.get<ColisService>(ColisService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
