import { Module } from '@nestjs/common';
import { PrestataireService } from './prestataire.service';
import { PrestataireController } from './prestataire.controller';

@Module({
  providers: [PrestataireService],
  controllers: [PrestataireController]
})
export class PrestataireModule {}
