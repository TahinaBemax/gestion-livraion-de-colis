import { Module } from '@nestjs/common';
import { CsvImportService } from './csv-import.service';
import { CsvImportController } from './csv-import.controller';
import { MulterModule } from '@nestjs/platform-express';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PointLivraisonEntity } from '../point-livraison/point-livraison.entity';
import { FileCleanUpHandlerService } from 'src/common/file-clean-up-handler/file-clean-up-handler.service';
import { ContrainteLivraisonEntity } from '../contrainte-livraison/contrainte-livraison.entity';

@Module({
  imports: [
    MulterModule.register({
      dest: "./uploads/csv" // Changed to CSV-specific directory
    }),
    TypeOrmModule.forFeature([
      PointLivraisonEntity,
      ContrainteLivraisonEntity
    ])
  ],
  providers: [
    CsvImportService,
    FileCleanUpHandlerService
  ],
  controllers: [CsvImportController]
})
export class CsvImportModule {}
