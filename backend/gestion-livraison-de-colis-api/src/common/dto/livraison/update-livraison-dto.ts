import { ApiProperty } from "@nestjs/swagger";
import { IsNumber, IsOptional } from "class-validator";
import { IsFRDate } from "src/common/validators/is-fr-date";
import { IsTime } from "src/common/validators/is-time.validator";

export class LivraisonUpdateDto {
    @IsOptional()
    @ApiProperty({example: "", required: false})
    nom_destinataire?: string;

    @IsOptional()
    @ApiProperty({example: "", required: false})
    complement_adresse?: string;

    @ApiProperty({description: "Une petite note", required: false})
    @IsOptional()
    notes?: string;
    
    @ApiProperty({example: "12/05/2025", required: false})
    @IsFRDate()
    @IsOptional()
    date_livraison?: string;
    
    @ApiProperty({example: "10:20:00", required: false})
    @IsTime()
    @IsOptional()
    heure_debut?: string;
    
    @ApiProperty({example: "14:00:00", required: false})
    @IsTime()
    @IsOptional()
    heure_fin?: string;
    
    @ApiProperty({example: "Avenue, RN7", required: false})
    @IsOptional()
    adresse_principale?: string;
    
    @ApiProperty({example: "Antananarivo", required: false})
    @IsOptional()
    ville?: string;
    
    @ApiProperty({example: "Madagascar", required: false})
    @IsOptional()
    pays?: string;
    
    @ApiProperty({example: "BII 101", required: false})
    @IsOptional()
    code_postal?: string;
    
    @IsOptional()
    @IsNumber()
    @ApiProperty({example: 1, required: false})
    id_client?: number;
}