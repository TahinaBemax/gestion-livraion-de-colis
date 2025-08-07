import { BadRequestException, Controller, Post, UploadedFile, UploadedFiles, UseInterceptors } from '@nestjs/common';
import { AnyFilesInterceptor, FileFieldsInterceptor, FileInterceptor } from '@nestjs/platform-express';
import path from 'path';
import { CsvImportService } from './csv-import.service';
import { diskStorage } from 'multer';

@Controller('csv-import')
export class CsvImportController {
    constructor(private readonly csvImportService: CsvImportService) {}

    // @Post('upload')
    // @UseInterceptors(FileInterceptor('file'))
    // async uploadCsv(@UploadedFile() file: Express.Multer.File) {
    //     if(!file) throw new BadRequestException("Fichier Introuvable.");
    //     const result = await this.csvImportService.importCsv(file.path);
    //     return result;
    // }

    // @Post('upload')
    // @UseInterceptors(AnyFilesInterceptor())
    // async uploadCsv(@UploadedFiles() files: Array<Express.Multer.File>) {
    //     if(!files) throw new BadRequestException("Fichier Introuvable.");
    //     const result = await this.csvImportService.importCsv(files[0].path, files[1].path, files[2].path);
    //     return result;
    // }

    @Post('upload')
    @UseInterceptors(
        FileFieldsInterceptor(
        [
            { name: 'point_livraison_fichier', maxCount: 1 },
            { name: 'contrainte_livraison_fichier', maxCount: 1 },
            { name: 'contrainte_jour_livraison_fichier', maxCount: 1 },
        ]),
    )
    async uploadCsv
    (
        @UploadedFiles() files: 
        {
            point_livraison_fichier: Express.Multer.File[],
            contrainte_livraison_fichier?: Express.Multer.File[],
            contrainte_jour_livraison_fichier?: Express.Multer.File[],
        }
    )
    {
        if(!files.point_livraison_fichier) throw new BadRequestException("Le point de livraison est obligatoire");

        const contrainte_livraison_fichier = files.contrainte_livraison_fichier ? files.contrainte_livraison_fichier[0].path : null;
        const contrainte_jour_livraison_fichier = files.contrainte_jour_livraison_fichier ? files.contrainte_jour_livraison_fichier[0].path : null;

        return await this.csvImportService.importCsv(
            files.point_livraison_fichier[0].path,
            contrainte_livraison_fichier,
            contrainte_jour_livraison_fichier,
        );
    }
}
