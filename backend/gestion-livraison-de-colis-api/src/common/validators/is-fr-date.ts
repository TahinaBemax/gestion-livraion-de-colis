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
          if (typeof value !== 'string') return false;

          const parsed = parse(value, 'dd/MM/yyyy', new Date());
          return isValid(parsed) && format(parsed, 'dd/MM/yyyy') === value;
        },
        defaultMessage() {
          return 'Le format de la date doit être en dd/MM/yyyy';
        },
      },
    });
  };
}
