import { IsBoolean, IsEnum, IsNotEmpty } from "class-validator";
import { CreateUserDto } from "../create-user-dto";
import { CategorieLivreurEnum } from "src/common/enum/categorie-livreur.enum";
import { ApiProperty } from "@nestjs/swagger";

export class CreateLivreurDto {
    @ApiProperty({
        type: CreateUserDto,
        example: {nom: "tahina", prenom:"bemax", etc:"..."}
    })
    user: CreateUserDto;

    @IsBoolean()
    @ApiProperty({
        example: true
    })
    peut_faire_chargement_colis: boolean;
    
    @IsNotEmpty()
    @ApiProperty({
        example: "qr_code_12132343"
    })
    qr_code: string;
    
    @IsEnum(CategorieLivreurEnum)
    @ApiProperty({
        example: "CAT-LIVREUR-00001"
    })
    id_categorie_livreur: string;
}