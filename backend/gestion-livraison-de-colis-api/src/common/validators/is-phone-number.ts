import { ValidationOptions, registerDecorator, ValidationArguments } from "class-validator";
import parsePhoneNumberFromString, { CountryCode } from "libphonenumber-js";

export function IsPhoneNumber(
  allowedRegions: CountryCode[] = ['FR', 'US', 'MG'],
  validationOptions?: ValidationOptions,
) {
  return function (object: Object, propertyName: string) {
    registerDecorator({
      name: 'isPhoneNumberAllowedRegions',
      target: object.constructor,
      propertyName,
      options: validationOptions,
      validator: {
        validate(value: any, args: ValidationArguments) {
          if(value == null) return true;
          if (typeof value !== 'string') return false;

          for (const region of allowedRegions) {
            try {
              const phone = parsePhoneNumberFromString(value, region);
              if (phone?.isValid()) {
                return true;
              }
            } catch {
              continue;
            }
          }

          return false;
        },

        defaultMessage(): string {
          return `Le format de numero de téléphone est invalid, format autorisés: ${allowedRegions.join(', ')}`;
        },
      },
    });
  };
}
