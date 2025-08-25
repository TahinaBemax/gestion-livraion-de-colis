import { IsEmail, IsEnum, IsNotEmpty, IsOptional, IsStrongPassword } from "class-validator";
import { IsFRDate } from "src/common/validators/is-fr-date";
import { IsImageFormat } from "src/common/validators/is-image-format";
import { IsPhoneNumber } from "src/common/validators/is-phone-number";
import { UserRole } from "src/common/enum/user-role.enum";

export class UpdateUserDto {
    @IsNotEmpty()
    @IsOptional()
    nom?: string;
    
    @IsNotEmpty()
    @IsOptional()
    prenom?: string;
    
    @IsNotEmpty({message: "La civilite est obligatoire. (Madame, Monsieur, etc.)"})
    @IsOptional()
    civilite?: string;
    
    @IsFRDate()
    @IsOptional()
    date_naissance?: string;
    
    @IsPhoneNumber()
    @IsOptional()
    numero_telephone?: string;
    
    @IsNotEmpty()
    @IsEmail()
    @IsOptional()
    adresse_email?: string;
    
    @IsImageFormat()
    @IsOptional()
    photo_profil?: string;
    
    @IsEnum(UserRole)
    @IsOptional()
    role?: string;
}
