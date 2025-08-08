import { BadRequestException } from '@nestjs/common';
import {
  registerDecorator,
  ValidationOptions,
  ValidationArguments,
} from 'class-validator';
import { parse, isValid, format } from 'date-fns';

export function IsFRDate(validationOptions?: ValidationOptions) {
  return function (object: Object, propertyName: string) {
    registerDecorator({
      name: 'isFRDate',
      target: object.constructor,
      propertyName,
      options: validationOptions,
      validator: {
        validate(value: any, args: ValidationArguments) {
          if (typeof value !== 'string') {
            throw new BadRequestException(`Le champ ${propertyName} doit être une chaîne de caractères`);
          }

          const parsed = parse(value, 'dd/MM/yyyy', new Date());
          const isValidDate = isValid(parsed) && format(parsed, 'dd/MM/yyyy') === value;
          
          if (!isValidDate) {
            throw new BadRequestException(`Le format de la date pour ${propertyName} doit être en dd/MM/yyyy. Valeur reçue: ${value}`);
          }
          
          return true;
        },
        defaultMessage() {
          return 'Le format de la date doit être en dd/MM/yyyy';
        },
      },
    });
  };
}
