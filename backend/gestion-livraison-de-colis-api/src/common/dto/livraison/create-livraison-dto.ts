import { ApiProperty } from "@nestjs/swagger";
import { IsArray, IsNotEmpty, IsNumber, IsOptional } from "class-validator";
import { IsFRDate } from "src/common/validators/is-fr-date";
import { IsTime } from "src/common/validators/is-time.validator";
import { DetailColisDto } from "../colis/detail-colis-dto";

export class LivraisonCreateDto {
    @ApiProperty({description: "Une petite note"})
    @IsOptional()
    notes?: string;
    
    @IsFRDate()
    @ApiProperty({example: "12/05/2025"})
    date_livraison: string;
    
    @ApiProperty({
        example: "10:20:00"
    })
    @IsTime()
    @IsOptional()
    heure_debut: string;
    
    @ApiProperty({
        example: "14:00:00"
    })
    @IsTime()
    @IsNotEmpty()
    heure_fin: string;
             
    @IsNotEmpty()
    @IsArray()
    @ApiProperty({
        type: [DetailColisDto],
        example: [
            {
                nom_destinataire: "",
                details_colis: 
                [
                    {
                        description: "",
                        poids: 0,
                        valeur_declaree: 20
                    }
                ]
            }
        ]
    })
    colis: DetailColisDto[];

    @IsNotEmpty()
    @IsNumber()
    @ApiProperty({example: 1})
    id_client: number;
}