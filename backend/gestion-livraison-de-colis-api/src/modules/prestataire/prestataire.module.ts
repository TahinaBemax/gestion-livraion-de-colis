import { Module } from '@nestjs/common';
import { PrestataireService } from './prestataire.service';
import { PrestataireController } from './prestataire.controller';
import { Prestataire } from './prestataire.entity';

@Module({
  providers: [PrestataireService],
  controllers: [PrestataireController],
  exports:[Prestataire, PrestataireService]
})
export class PrestataireModule {}
