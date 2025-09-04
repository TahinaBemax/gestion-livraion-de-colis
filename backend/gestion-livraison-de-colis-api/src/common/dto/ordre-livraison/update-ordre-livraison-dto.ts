import { ApiProperty } from "@nestjs/swagger";
import { IsEnum, IsNumber } from "class-validator";
import { StatutOrdreLivraison } from "src/common/enum/statut-ordre-livraison.enum";
import { IsTime } from "src/common/validators/is-time.validator";

export class OrdreLivraisonUpdateDto {
    @IsNumber()
    @ApiProperty({
        required: false
    })
    point_obtenu?:number;
    
    @IsTime()
    @ApiProperty({
        required: false
    })
    estimation_retard?: string;
    
    @IsNumber()
    @ApiProperty({
        required: false
    })
    nbr_colis_prevu?: number;
    
    @IsNumber()
    @ApiProperty({
        required: false
    })
    nbr_colis_reel?: number;

    @IsEnum(StatutOrdreLivraison)
    @ApiProperty({
        example: "En attente, En cours, Annulé, Effecuté",
        required: false
    })
    statut?: string;
}