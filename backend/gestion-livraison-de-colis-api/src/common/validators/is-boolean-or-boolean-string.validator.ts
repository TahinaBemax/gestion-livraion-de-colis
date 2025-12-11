import { registerDecorator, ValidationOptions, ValidationArguments } from 'class-validator';

export function IsBooleanOrBooleanString(validationOptions?: ValidationOptions) {
    return function (object: object, propertyName: string) {
        registerDecorator({
            name: 'IsBooleanOrBooleanString',
            target: object.constructor,
            propertyName: propertyName,
            constraints: [],
            options: validationOptions,
            validator: {
                validate(value: any, args: ValidationArguments) {
                    if (typeof value === 'boolean') {
                        return true; // valid boolean
                    }

                    if (typeof value === 'string') {
                        return value.toLowerCase() === 'true' || value.toLowerCase() === 'false'; // valid boolean string
                    }

                    return false; // invalid if it's neither boolean nor a boolean string
                },
                defaultMessage(args: ValidationArguments) {
                    return `${args.property} doit être un boolean ou un chaîne de carracteres 'true'/'false'`;
                },
            },
        });
    };
}
