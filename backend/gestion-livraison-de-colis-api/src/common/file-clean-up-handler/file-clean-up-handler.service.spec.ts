import { Test, TestingModule } from '@nestjs/testing';
import { FileCleanUpHandlerService } from './file-clean-up-handler.service';

describe('FileCleanUpHandlerService', () => {
  let service: FileCleanUpHandlerService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [FileCleanUpHandlerService],
    }).compile();

    service = module.get<FileCleanUpHandlerService>(FileCleanUpHandlerService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
