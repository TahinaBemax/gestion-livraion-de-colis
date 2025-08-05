import { IsNotEmpty, IsNumber, IsOptional } from "class-validator";
import { ExistsInDatabase } from "src/common/validators/is-exist-in-database.validator";
import { AnimationVille } from "src/modules/point-livraison/animation-ville/animation-ville.entity";
import { ContrainteLivraison } from "src/modules/point-livraison/contrainte-livraison/contrainte-livraison.entity";
import { Prestataire } from "src/modules/prestataire/prestataire.entity";

export class PointLivraisonCreateDto {
    @IsNotEmpty()
    numero_magasin: string;

    @IsNotEmpty()
    nom_rue?: string;

    @IsNotEmpty()
    departement: string;

    @IsNotEmpty()
    ville: string;

    @IsNotEmpty()
    pays: string;

    @IsNumber()
    latitude: number;

    @IsNumber()
    longitude: string;

    @IsNotEmpty()
    code_postal: string;

    complement_adresse?: string;

    @IsOptional()
    @ExistsInDatabase(Prestataire, "id_prestataire")
    prestataire?: number;
    
    @IsOptional()
    @ExistsInDatabase(ContrainteLivraison, "id__contrainte_livraison")
    contraintes_livraison?: number[];
    
    @IsOptional()
    @ExistsInDatabase(AnimationVille, "id__animation_ville")
    animations_ville?: number[];
}