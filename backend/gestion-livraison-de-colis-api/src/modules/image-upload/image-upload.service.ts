import { Injectable, Logger } from '@nestjs/common';
import { FileCleanUpHandlerService } from 'src/common/file-clean-up-handler/file-clean-up-handler.service';

@Injectable()
export class ImageUploadService {
  private readonly logger = new Logger(ImageUploadService.name);

  constructor(
    private readonly fileCleanupService: FileCleanUpHandlerService
  ) {}

  async uploadImage(file: Express.Multer.File): Promise<{ 
    success: boolean; 
    filePath: string; 
    message: string 
  }> {
    try {
      // Move file to images directory (if not already there)
      const finalPath = await this.fileCleanupService.moveFileToDirectory(file, 'images');
      
      this.logger.log(`Image uploaded successfully: ${finalPath}`);
      
      return {
        success: true,
        filePath: finalPath,
        message: 'Image uploaded successfully'
      };
    } catch (error) {
      this.logger.error('Image upload failed:', error);
      return {
        success: false,
        filePath: '',
        message: 'Image upload failed'
      };
    }
  }

  async getUploadStats() {
    return this.fileCleanupService.getUploadStats();
  }
}
