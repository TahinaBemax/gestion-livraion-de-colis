import { IsEmail, IsEnum, IsNotEmpty, IsOptional, IsStrongPassword } from "class-validator";
import { IsFRDate } from "src/common/validators/is-fr-date";
import { IsImageFormat } from "src/common/validators/is-image-format";
import { IsPhoneNumber } from "src/common/validators/is-phone-number";
import { UserRole } from "src/common/enum/user-role.enum";
import { ApiProperty } from "@nestjs/swagger";

export class UpdateUserDto {
    @IsNotEmpty()
    @IsOptional()
    @ApiProperty({required: false})    
    nom?: string;
    
    @IsNotEmpty()
    @IsOptional()  
    @ApiProperty({required: false})    
    prenom?: string;
    
    @IsNotEmpty({message: "La civilite est obligatoire. (Madame, Monsieur, etc.)"})
    @IsOptional()
    @ApiProperty({required: false})    
    civilite?: string;
    
    @IsFRDate()
    @IsOptional()
    @ApiProperty({required: false})    
    date_naissance?: string;
    
    @IsPhoneNumber()
    @IsOptional()
    @ApiProperty({required: false})    
    numero_telephone?: string;
    
    @IsNotEmpty()
    @IsEmail()
    @IsOptional()
    @ApiProperty({required: false})    
    adresse_email?: string;
    
    @IsImageFormat()
    @IsOptional()
    @ApiProperty({required: false})    
    photo_profil?: string;
    
    @IsEnum(UserRole)
    @IsOptional()
    @ApiProperty({required: false})    
    role?: string;
}
