import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsNumber, IsNumberString } from "class-validator";
import { IsFRDate } from "src/common/validators/is-fr-date";
import { IsTime } from "src/common/validators/is-time.validator";

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
    @ApiProperty()
    rue: string;

    @IsNotEmpty()
    @ApiProperty()
    ville: string;
    
    @IsNotEmpty()
    @ApiProperty()
    pays: string;

    @IsNotEmpty()
    @IsNumberString()
    @ApiProperty()
    code_postal: string;   
    
    @IsNotEmpty()
    @IsNumber()
    @ApiProperty()
    id_colis: number;
    
    @IsNotEmpty()
    @IsNumber()
    @ApiProperty()
    id_point_livraison: number;
}