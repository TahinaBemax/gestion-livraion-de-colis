import { ValidatorConstraint, ValidatorConstraintInterface, ValidationArguments, Validate } from 'class-validator';

@ValidatorConstraint({ name: 'IsTime', async: false })
export class IsTimeConstraint implements ValidatorConstraintInterface {
  validate(value: string, args: ValidationArguments) {
    if(!value || value.trim() == '' || value.toLowerCase() == "null"){
      const obj = args.object as any;
      obj[args.property] = undefined;
      return true;
    } 

    // Regex for valid time format HH:mm ou HH:mm:ss (24-hour format)
    const timeRegex = /^([01]?[0-9]|2[0-3]):([0-5][0-9])(:([0-5][0-9]))?$/;
    return typeof value === 'string' && timeRegex.test(value);
  }

  defaultMessage(args: ValidationArguments) {
    return `${args.property} doit être une heure valid en HH:mm format`;
  }
}

export function IsTime() {
  return Validate(IsTimeConstraint);
}
