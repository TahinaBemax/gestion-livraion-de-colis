import { IsEmail, IsEnum, IsNotEmpty, IsOptional, IsPhoneNumber } from "class-validator";
import { CategorieLivreurEnum } from "src/common/enum/categorie-livreur.enum";
import { ApiProperty } from "@nestjs/swagger";
import { IsFRDate } from "src/common/validators/is-fr-date";
import { IsImageFormat } from "src/common/validators/is-image-format";

export class LivreurUpdateDto {
    @IsNotEmpty()
    @IsOptional()
    @ApiProperty({
        example: "John"
    })
    nom?: string;
    
    @IsNotEmpty()
    @IsOptional()
    @ApiProperty({
        example: "Doe"
    })
    prenom?: string;
    
    @IsNotEmpty({message: "La civilite est obligatoire. (Madame, Monsieur, etc.)"})
    @ApiProperty({
        example: "Monsieur" 
    })
    civilite: string;
    
    @IsFRDate()
    @IsNotEmpty()
    @ApiProperty({
        example: "25/12/1990"
    })
    date_naissance: string;
    
    @IsPhoneNumber()
    @IsNotEmpty()
    @ApiProperty({
        example: "+261340000000"
    })
    numero_telephone: string;
    
    @IsNotEmpty()
    @IsEmail()
    @IsOptional()
    @ApiProperty({
        example: "exemple@itu.com"
    })
    adresse_email?: string;

    @IsImageFormat()
    @IsOptional()
    @ApiProperty({
        example: "data:image/png;base64,iVBORw0KGgoAAAANSU.jpg"
    })
    photo_profil?: string;
    
    @IsEnum(CategorieLivreurEnum)
    @ApiProperty({
        example: "CAT-LIVREUR-00001"
    })
    @IsOptional()
    id_categorie_livreur?: string;
}