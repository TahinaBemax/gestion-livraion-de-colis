import { Injectable } from '@nestjs/common';
import { registerDecorator, ValidationArguments, ValidatorConstraint, ValidatorConstraintInterface } from 'class-validator';
import { ValidationOptions } from 'class-validator/types/decorator/ValidationOptions';
import { PrestataireService } from 'src/modules/prestataire/prestataire.service';

@ValidatorConstraint({ name: 'IsPrestataireExistsInDatabase', async: true })
@Injectable()
export class IsPrestataireExistsInDatabaseConstraint implements ValidatorConstraintInterface {
    constructor(private readonly prestataireService: PrestataireService) {}

    async validate(value: any, args: ValidationArguments): Promise<boolean> {
        if (!value) return false;

        try {
            const prestataire = await this.prestataireService.findById(value);

            return !!prestataire;
        } catch (error) {
            console.error('IsPrestataireExistsInDatabase validation error:', error);
            return false;
        }
    }

    defaultMessage(args: ValidationArguments): string {
        return `Prestataire id:'${args.value}' n'exist pas`;
    }
}

export function IsExistingPrestataire(validationOptions?: ValidationOptions) {
    return function (object: Object, propertyName: string) {
        registerDecorator({
            target: object.constructor,
            propertyName: propertyName,
            options: validationOptions,
            validator: IsPrestataireExistsInDatabaseConstraint,
        });
    };
}