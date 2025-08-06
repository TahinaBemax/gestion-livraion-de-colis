import { Module } from '@nestjs/common';
import { CsvImportService } from './csv-import.service';
import { CsvImportController } from './csv-import.controller';

@Module({
  providers: [CsvImportService],
  controllers: [CsvImportController]
})
export class CsvImportModule {}
