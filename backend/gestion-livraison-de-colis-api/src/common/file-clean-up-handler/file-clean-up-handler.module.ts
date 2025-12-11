import { Module } from '@nestjs/common';
import { FileCleanUpHandlerService } from './file-clean-up-handler.service';

@Module({
  providers: [FileCleanUpHandlerService],
  exports: [FileCleanUpHandlerService]
})
export class FileCleanUpHandlerModule {}
