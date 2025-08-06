import { registerDecorator, ValidationArguments, ValidatorConstraint, ValidatorConstraintInterface } from 'class-validator';
import { ValidationOptions } from 'class-validator/types/decorator/ValidationOptions';
import { Injectable } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { InjectDataSource } from '@nestjs/typeorm';

@ValidatorConstraint({ name: 'ExistsInDatabase', async: true })
@Injectable()
export class ExistsInDatabaseConstraint implements ValidatorConstraintInterface {
    constructor(@InjectDataSource() private readonly dataSource: DataSource) {}

    async validate(value: any, args: ValidationArguments): Promise<boolean> {
        if (!value) {
            return false;
        }

        const [entityClass, field] = args.constraints;
        
        try {
            const repo = this.dataSource.getRepository(entityClass);
            const whereCondition = {};
            whereCondition[field] = value;
            
            const entity = await repo.findOne({
                where: whereCondition
            });
            
            return !!entity;
        } catch (error) {
            return false;
        }
    }

    defaultMessage(args: ValidationArguments): string {
        const [entityClass, field] = args.constraints;
        return `${entityClass.name} avec ${field} '${args.value}' n'exist pas`;
    }
}

export function ExistsInDatabase(entityClass: any, field: string, validationOptions?: ValidationOptions) {
    return function (object: Object, propertyName: string) {
        registerDecorator({
            target: object.constructor,
            propertyName: propertyName,
            options: validationOptions,
            constraints: [entityClass, field],
            validator: ExistsInDatabaseConstraint,
        });
    };
}