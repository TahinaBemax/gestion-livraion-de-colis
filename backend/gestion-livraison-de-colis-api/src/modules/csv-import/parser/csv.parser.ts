// csv.parser.ts
import { plainToInstance } from 'class-transformer';
import { validate } from 'class-validator';
import * as fs from 'fs';
import * as fastcsv from 'fast-csv';
import { BadRequestException } from '@nestjs/common';

export interface ParsedCsv<T extends object>{
    success: T[],
    errors: any[]
}


export class CsvParser {
    static async parseFromCsvToInstance<T extends object>
    (
        filePath: string,
        DtoClass: new () => T,
        onValidRow?: (dto: T) => Promise<void> | void,
    ): Promise<ParsedCsv<T>> 
    {
        const successRows: T[] = [];
        const errorRows: any[] = [];

        return new Promise((resolve, reject) => {
        fs.createReadStream(filePath)
            .pipe(fastcsv.parse({ headers: true }))
            .on('error', (error) => {
                reject(new BadRequestException('Invalid CSV file'));
            })
            .on('data', async (row) => {
                const dto = plainToInstance(DtoClass, row);
                const errors = await validate(dto);

                if (errors.length > 0) {
                    errorRows.push({ row, errors });
                } else {
                    successRows.push(dto);
                    if (onValidRow) {
                        await onValidRow(dto);
                    }
                }
            })
            .on('end', () => {
                const result: ParsedCsv<T> = {
                    success: successRows, 
                    errors: errorRows
                };

                resolve(result);
            });
        });
    }
}
