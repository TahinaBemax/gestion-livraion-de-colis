import { TypeOrmModule } from '@nestjs/typeorm';
import { Module } from '@nestjs/common';
import { ColisController } from './colis.controller';
import { ColisService } from './colis.service';
import { ColisEntity } from './colis.entity';
import { DetailColisEntity } from './detail-colis.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      ColisEntity,
      DetailColisEntity
    ])
  ],
  controllers: [ColisController],
  providers: [ColisService]
})
export class ColisModule {}
