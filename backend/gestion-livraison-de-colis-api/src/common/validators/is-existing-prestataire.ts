import { Prestataire } from './../../modules/prestataire/prestataire.entity';
import { registerDecorator, ValidationArguments } from 'class-validator';
import { ValidationOptions } from 'class-validator/types/decorator/ValidationOptions';

export function IsExistingPrestataire(validationOptions?: ValidationOptions){
    const prestataires: Prestataire[] = [];
    
    return function (object: Object, propertyName: string) {
        registerDecorator({
            name: 'IsExistingPrestataire',
            target:object.constructor,
            propertyName,
            options: validationOptions,
            validator: {
                validate(value: any, args: ValidationArguments){
                    if(typeof value !== "string") {
                        value.toString();
                    };

                    prestataires.forEach(e => {
                        if(parseInt(value) == e.id_prestataire) return true;
                    });

                    return false;
                },
                defaultMessage(){
                    return `Prestataire introuvable!`;
                },
            },
        })
    }
}