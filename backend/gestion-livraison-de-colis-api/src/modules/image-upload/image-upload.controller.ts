import { Controller, Post, UploadedFile, UseInterceptors, Get } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiTags, ApiConsumes, ApiBody, ApiResponse } from '@nestjs/swagger';
import { ImageUploadService } from './image-upload.service';
import { Roles } from 'src/common/decorators/roles.decorator';
import { UserRole } from 'src/common/enum/user-role.enum';

@ApiTags('Image Upload')
@Controller('image-upload')
@Roles(UserRole.Admin, UserRole.ResponsableExploitation)
export class ImageUploadController {
  constructor(private readonly imageUploadService: ImageUploadService) {}

  @Post('upload')
  @UseInterceptors(FileInterceptor('image'))
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        image: {
          type: 'string',
          format: 'binary',
        },
      },
    },
  })
  @ApiResponse({ status: 201, description: 'Image uploaded successfully' })
  async uploadImage(@UploadedFile() file: Express.Multer.File) {
    return this.imageUploadService.uploadImage(file);
  }

  @Get('stats')
  @ApiResponse({ status: 200, description: 'Upload statistics' })
  async getStats() {
    return this.imageUploadService.getUploadStats();
  }
}

