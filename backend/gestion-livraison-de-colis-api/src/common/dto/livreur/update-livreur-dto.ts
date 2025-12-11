import { IsEmail, IsEnum, IsNotEmpty, IsOptional, IsPhoneNumber } from "class-validator";
import { CategorieLivreurEnum } from "src/common/enum/categorie-livreur.enum";
import { ApiProperty } from "@nestjs/swagger";
import { IsFRDate } from "src/common/validators/is-fr-date";
import { IsImageFormat } from "src/common/validators/is-image-format";

export class LivreurUpdateDto {
    @IsNotEmpty()
    @IsOptional()
    @ApiProperty({
        example: "John",
        required: false
    })
    nom?: string;
    
    @IsNotEmpty()
    @IsOptional()
    @ApiProperty({
        example: "Doe",
        required: false
    })
    prenom?: string;
    
    @IsNotEmpty({message: "La civilite est obligatoire. (Madame, Monsieur, etc.)"})
    @IsOptional()
    @ApiProperty({
        example: "Monsieur" ,
        required: false
    })
    civilite?: string;
    
    @IsFRDate()
    @IsOptional()
    @ApiProperty({
        example: "25/12/1990",
        required: false
    })
    date_naissance?: string;
    
    @IsPhoneNumber()
    @IsOptional()
    @ApiProperty({
        example: "+261340000000",
        required: false
    })
    numero_telephone?: string;
    
    @IsEmail()
    @IsOptional()
    @ApiProperty({
        example: "exemple@itu.com",
        required: false
    })
    adresse_email?: string;

    @IsImageFormat()
    @IsOptional()
    @ApiProperty({
        example: "data:image/png;base64,iVBORw0KGgoAAAANSU.jpg",
        required: false
    })
    photo_profil?: string;
    
    @IsEnum(CategorieLivreurEnum)
    @ApiProperty({
        example: "CAT-LIVREUR-00001",
        required: false
    })
    @IsOptional()
    id_categorie_livreur?: string;
}