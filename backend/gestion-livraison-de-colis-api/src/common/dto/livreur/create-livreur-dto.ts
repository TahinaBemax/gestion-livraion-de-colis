import { IsBoolean, IsEnum, IsNotEmpty } from "class-validator";
import { CreateUserDto } from "../create-user-dto";
import { CategorieLivreurEnum } from "src/common/enum/categorie-livreur.enum";

export class CreateLivreurDto {
    user: CreateUserDto;

    @IsBoolean()
    peut_faire_chargement_colis: boolean;
    
    @IsNotEmpty()
    qr_code: string;
    
    @IsEnum(CategorieLivreurEnum)
    id_categorie_livreur: string;
}