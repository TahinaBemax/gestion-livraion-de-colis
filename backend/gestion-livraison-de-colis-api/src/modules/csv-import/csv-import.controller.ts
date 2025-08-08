import { BadRequestException, Controller, Post, UploadedFiles, UseInterceptors } from '@nestjs/common';
import { FileFieldsInterceptor } from '@nestjs/platform-express';
import { ApiBadRequestResponse, ApiBody, ApiCreatedResponse, ApiInternalServerErrorResponse } from '@nestjs/swagger';
import { ImportBodyDto } from 'src/common/dto/csv-import/import-body-dto';
import { CsvImportService } from './csv-import.service';
import { ImportCsvRestult } from 'src/common/dto/csv-import/import-result-dto';

@Controller('csv-import')
export class CsvImportController {
    constructor(private readonly csvImportService: CsvImportService) {}

    @Post('upload')
    @UseInterceptors(
        FileFieldsInterceptor(
        [
            { name: 'point_livraison_fichier', maxCount: 1 },
            { name: 'contrainte_livraison_fichier', maxCount: 1 },
            { name: 'contrainte_jour_livraison_fichier', maxCount: 1 },
        ]),
    )
    @ApiBody({type: ImportBodyDto})
    @ApiBadRequestResponse({description: "Données Invalides"})
    @ApiCreatedResponse({type: ImportCsvRestult})
    @ApiInternalServerErrorResponse({description: "Internal Server Error"})
    async uploadCsv(@UploadedFiles() files: ImportBodyDto)
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
