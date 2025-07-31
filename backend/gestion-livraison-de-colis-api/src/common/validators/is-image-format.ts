import {
  registerDecorator,
  ValidationOptions,
  ValidationArguments,
} from 'class-validator';

export function IsImageFormat(validationOptions?: ValidationOptions) {
    const extenions: string[] = [".jpg", ".png", "jpeg"];

    return function (object: Object, propertyName: string) {
        registerDecorator({
            name: 'IsImageFormat',
            target: object.constructor,
            propertyName,
            options: validationOptions,
            validator: {
                validate(value: any, args: ValidationArguments){
                    if(value == null) return true;

                    if(typeof value !== "string") return false;

                    extenions.forEach(e => {
                        if(value.endsWith(e)) return true;
                    });

                    return false;
                },
                defaultMessage(){
                    return `Le format de l'image doit être: ${extenions.join(", ")} `;
                },
            },
        });
    };
}