import { Test, TestingModule } from '@nestjs/testing';
import { CsvImportService } from './csv-import.service';

describe('CsvImportService', () => {
  let service: CsvImportService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CsvImportService],
    }).compile();

    service = module.get<CsvImportService>(CsvImportService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
