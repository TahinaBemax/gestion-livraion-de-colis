import { IsBoolean, IsDateString, IsEmail, IsEnum, IsNotEmpty, IsOptional, IsStrongPassword } from "class-validator";
import { IsFRDate } from "src/common/validators/is-fr-date";
import { IsImageFormat } from "src/common/validators/is-image-format";
import { IsPhoneNumber } from "src/common/validators/is-phone-number";
import { UserRole } from "src/common/enum/user-role.enum";
import { TypeUtilisateur } from "src/common/enum/type-utilisateur.enum";
export class CreateUserDto {
    @IsNotEmpty()
    nom: string;
    
    @IsNotEmpty()
    prenom: string;

    @IsNotEmpty({message: "La civilite est obligatoire. (Madame, Monsieur, etc.)"})
    civilite: string;

    @IsDateString()
    @IsFRDate()
    date_naissance: string;

    @IsPhoneNumber()
    telephone?: string;

    @IsNotEmpty()
    @IsEmail()
    email: string;

    @IsNotEmpty()
    login: string;

    @IsNotEmpty()
    @IsStrongPassword()
    mot_de_passe: string;

    @IsBoolean()
    est_active: boolean;

    @IsImageFormat()
    photo_profil?: string;

    @IsEnum(UserRole)
    role: string;

    @IsEnum(TypeUtilisateur)
    type_utilisateur: string;

    @IsOptional()
    prestataire?: number;
}
