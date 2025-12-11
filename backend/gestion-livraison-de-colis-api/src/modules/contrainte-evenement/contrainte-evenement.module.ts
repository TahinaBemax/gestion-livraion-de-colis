import { Module } from '@nestjs/common';
import { ContrainteEvenementService } from './contrainte-evenement.service';
import { ContrainteEvenementController } from './contrainte-evenement.controller';

@Module({
  providers: [ContrainteEvenementService],
  controllers: [ContrainteEvenementController]
})
export class ContrainteEvenementModule {}
