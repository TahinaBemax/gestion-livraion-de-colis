import { IsBoolean,IsEmpty } from "class-validator";
import { ExistsInDatabase } from "src/common/validators/is-exist-in-database.validator";
import { CategorieLivreur } from "src/modules/livreur/categorie-livreur/categorie-livreur.entity";
import { CreateUserDto } from "../create-user-dto";

export class CreateLivreurDto {
    user: CreateUserDto;

    @IsBoolean()
    peut_faire_chargement_colis: boolean;
    
    @IsEmpty()
    qr_code: string;
    
    @ExistsInDatabase(CategorieLivreur, 'id_categorie_livreur')
    id_categorie_livreur: string;
}