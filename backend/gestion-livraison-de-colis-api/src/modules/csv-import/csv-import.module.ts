import { Module } from '@nestjs/common';
import { CsvImportService } from './csv-import.service';
import { CsvImportController } from './csv-import.controller';
import { MulterModule } from '@nestjs/platform-express';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PointLivraisonEntity } from '../point-livraison/point-livraison.entity';


@Module({
  imports: [
    MulterModule.register({
      dest: "./uploads"
    }),
    TypeOrmModule.forFeature([
      PointLivraisonEntity
    ])
  ],
  providers: [
    CsvImportService
  ],
  controllers: [CsvImportController]
})
export class CsvImportModule {}
