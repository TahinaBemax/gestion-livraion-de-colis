import { ApiProperty } from "@nestjs/swagger";
import { IsArray, IsNotEmpty, IsNumber, IsNumberString } from "class-validator";
import { IsFRDate } from "src/common/validators/is-fr-date";
import { IsTime } from "src/common/validators/is-time.validator";
import { ColisCreateDto } from "../colis/create-colis-dto";

export class LivraisonCreateDto {
    @ApiProperty()
    notes: string;

    @IsFRDate()
    @ApiProperty()
    date_livraison: string;

    @IsNotEmpty()
    @ApiProperty()
    @IsTime()
    heure_debut: string;
    
    @IsTime()
    @IsNotEmpty()
    @ApiProperty()
    heure_fin: string;
         
    @IsNotEmpty()
    @IsArray()
    @ApiProperty({
        type: ColisCreateDto,
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
    colis: ColisCreateDto[];
    
    @IsNotEmpty()
    @IsNumber()
    @ApiProperty()
    id_point_livraison: number;
}