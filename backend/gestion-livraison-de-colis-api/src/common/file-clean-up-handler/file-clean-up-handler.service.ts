import { Injectable, Logger } from '@nestjs/common';
import * as fs from 'fs';
import * as path from 'path';

@Injectable()
export class FileCleanUpHandlerService {
  private readonly logger = new Logger(FileCleanUpHandlerService.name);
  
  // Define upload directories
  private readonly uploadsDir = './uploads';
  private readonly csvDir = path.join(this.uploadsDir, 'csv');
  private readonly imagesDir = path.join(this.uploadsDir, 'images');

  constructor() {
    this.ensureDirectoriesExist();
  }

  /**
   * Ensure upload directories exist
   */
  private ensureDirectoriesExist(): void {
    [this.uploadsDir, this.csvDir, this.imagesDir].forEach(dir => {
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
        this.logger.log(`Created directory: ${dir}`);
      }
    });
  }

  /**
   * Clean up CSV files only (temporary files)
   */
  async cleanupCsvFiles(filePaths: (string | null)[]): Promise<void> {
    const validPaths = filePaths.filter(path => path !== null) as string[];
    
    if (validPaths.length === 0) return;

    const cleanupPromises = validPaths.map(filePath => this.cleanupFile(filePath));
    await Promise.allSettled(cleanupPromises);
  }

  /**
   * Clean up a single file
   */
  async cleanupFile(filePath: string): Promise<void> {
    try {
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
        this.logger.log(`File cleaned up: ${filePath}`);
      }
    } catch (error) {
      this.logger.error(`Failed to cleanup file ${filePath}:`, error);
    }
  }

  /**
   * Clean up all CSV files in csv directory (for maintenance)
   */
  async cleanupAllCsvFiles(): Promise<void> {
    try {
      if (!fs.existsSync(this.csvDir)) return;

      const files = fs.readdirSync(this.csvDir);
      const cleanupPromises = files.map(file => 
        this.cleanupFile(path.join(this.csvDir, file))
      );
      
      await Promise.allSettled(cleanupPromises);
      this.logger.log('All CSV files cleaned up');
    } catch (error) {
      this.logger.error('Failed to cleanup CSV directory:', error);
    }
  }

  /**
   * Clean up all files in uploads directory (for maintenance)
   */
  async cleanupAllUploads(): Promise<void> {
    try {
      if (!fs.existsSync(this.uploadsDir)) return;

      const files = fs.readdirSync(this.uploadsDir);
      const cleanupPromises = files.map(file => {
        const filePath = path.join(this.uploadsDir, file);
        const stats = fs.statSync(filePath);
        
        // Only delete if it's a file (not a directory)
        if (stats.isFile()) {
          return this.cleanupFile(filePath);
        }
        return Promise.resolve();
      });
      
      await Promise.allSettled(cleanupPromises);
      this.logger.log('All upload files cleaned up');
    } catch (error) {
      this.logger.error('Failed to cleanup uploads directory:', error);
    }
  }

  /**
   * Get file size for logging
   */
  getFileSize(filePath: string): string {
    try {
      if (fs.existsSync(filePath)) {
        const stats = fs.statSync(filePath);
        return this.formatBytes(stats.size);
      }
      return '0 B';
    } catch {
      return '0 B';
    }
  }

  /**
   * Move uploaded file to appropriate directory
   */
  async moveFileToDirectory(file: Express.Multer.File, targetDir: 'csv' | 'images'): Promise<string> {
    const targetPath = path.join(this.uploadsDir, targetDir, file.filename);
    
    try {
      // If file is already in the target directory, return the path
      if (file.path === targetPath) {
        return targetPath;
      }

      // Move file to target directory
      fs.renameSync(file.path, targetPath);
      this.logger.log(`File moved to ${targetDir}: ${targetPath}`);
      return targetPath;
    } catch (error) {
      this.logger.error(`Failed to move file to ${targetDir}:`, error);
      // Return original path if move fails
      return file.path;
    }
  }

  /**
   * Get upload statistics
   */
  getUploadStats(): { csv: number; images: number; totalSize: string } {
    try {
      const csvCount = fs.existsSync(this.csvDir) ? fs.readdirSync(this.csvDir).length : 0;
      const imagesCount = fs.existsSync(this.imagesDir) ? fs.readdirSync(this.imagesDir).length : 0;
      
      let totalSize = 0;
      
      // Calculate CSV directory size
      if (fs.existsSync(this.csvDir)) {
        fs.readdirSync(this.csvDir).forEach(file => {
          const filePath = path.join(this.csvDir, file);
          const stats = fs.statSync(filePath);
          if (stats.isFile()) totalSize += stats.size;
        });
      }
      
      // Calculate images directory size
      if (fs.existsSync(this.imagesDir)) {
        fs.readdirSync(this.imagesDir).forEach(file => {
          const filePath = path.join(this.imagesDir, file);
          const stats = fs.statSync(filePath);
          if (stats.isFile()) totalSize += stats.size;
        });
      }

      return {
        csv: csvCount,
        images: imagesCount,
        totalSize: this.formatBytes(totalSize)
      };
    } catch (error) {
      this.logger.error('Failed to get upload stats:', error);
      return { csv: 0, images: 0, totalSize: '0 B' };
    }
  }

  private formatBytes(bytes: number): string {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  }
}    
