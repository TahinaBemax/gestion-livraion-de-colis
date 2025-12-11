import { Test, TestingModule } from '@nestjs/testing';
import { EvenementLocalService } from './evenement-local.service';

describe('EvenementLocalService', () => {
  let service: EvenementLocalService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [EvenementLocalService],
    }).compile();

    service = module.get<EvenementLocalService>(EvenementLocalService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
