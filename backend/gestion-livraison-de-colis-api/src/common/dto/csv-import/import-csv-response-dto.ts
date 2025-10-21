import { ApiProperty } from "@nestjs/swagger";
import { ContrainteJourLivraisonCsvDto } from "./contrainte-jour-livraison-csv-dto";
import { ContrainteLivraisonCsvDto } from "./contrainte-livraison-csv-dto";
import { PointLivraisonCsvDto } from "./point-livraison-csv-dto";

export class ImportCsvResponseDto {
    @ApiProperty()
    is_success: boolean;
    
    @ApiProperty()
    errors: {
        points_livraison: any[],
        contraintes_livraison: any[],
    };

    @ApiProperty()
    success_rows: {
        points_livraison: PointLivraisonCsvDto[],
        contraintes_livraison: ContrainteLivraisonCsvDto[]
    };

    @ApiProperty()
    message: string;
}