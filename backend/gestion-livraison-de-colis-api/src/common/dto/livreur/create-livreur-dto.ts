import { IsBoolean, IsEnum } from "class-validator";
import { CreateUserDto } from "../create-user-dto";
import { CategorieLivreurEnum } from "src/common/enum/categorie-livreur.enum";
import { ApiProperty } from "@nestjs/swagger";

export class CreateLivreurDto {
    @ApiProperty({
        type: CreateUserDto,
        example: {nom: "tahina", prenom:"bemax", etc:"..."}
    })
    user: CreateUserDto;    
    
    @IsEnum(CategorieLivreurEnum)
    @ApiProperty({
        example: "CAT-LIVREUR-00001"
    })
    id_categorie_livreur: string;
}