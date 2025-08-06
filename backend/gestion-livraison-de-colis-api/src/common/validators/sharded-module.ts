import { Module } from '@nestjs/common';
import { ExistsInDatabaseConstraint } from './is-exist-in-database.validator';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  providers: [ExistsInDatabaseConstraint],
  exports: [ExistsInDatabaseConstraint],
})
export class SharedModule {}
