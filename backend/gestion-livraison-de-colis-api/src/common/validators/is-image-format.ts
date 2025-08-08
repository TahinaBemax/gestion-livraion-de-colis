import {
  registerDecorator,
  ValidationOptions,
  ValidationArguments,
} from 'class-validator';

export function IsImageFormat(validationOptions?: ValidationOptions) {
    const extensions: string[] = [".jpg", ".png", ".jpeg"];

    return function (object: Object, propertyName: string) {
        registerDecorator({
            name: 'IsImageFormat',
            target: object.constructor,
            propertyName,
            options: validationOptions,
            validator: {
                validate(value: any, args: ValidationArguments){
                    if (value == null) return true;
                    if (typeof value !== "string") return false;
                    if (value.trim() === "") return false;

                    // Use some() instead of forEach() to properly return true/false
                    return extensions.some(ext => value.toLowerCase().endsWith(ext));
                },
                defaultMessage(){
                    return `Le format de l'image doit être: ${extensions.join(", ")} `;
                },
            },
        });
    };
}