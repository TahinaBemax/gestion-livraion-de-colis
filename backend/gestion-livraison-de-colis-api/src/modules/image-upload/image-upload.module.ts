import { Module } from '@nestjs/common';
import { MulterModule } from '@nestjs/platform-express';
import { ImageUploadService } from './image-upload.service';
import { ImageUploadController } from './image-upload.controller';
import { FileCleanUpHandlerService } from 'src/common/file-clean-up-handler/file-clean-up-handler.service';

@Module({
  imports: [
    MulterModule.register({
      dest: "./uploads/images" // Images directory
    })
  ],
  providers: [ImageUploadService, FileCleanUpHandlerService],
  controllers: [ImageUploadController]
})
export class ImageUploadModule {}
