import { ApiProperty } from "@nestjs/swagger";
import { IsEnum, IsNotEmpty, IsOptional } from "class-validator";
import { StatusColis } from "src/common/enum/status-colis.enum";
import { DetailColisUpdateDto } from "./update-detail-colis-dto";

export class ColisUpdateDto{
    @IsNotEmpty()
    @ApiProperty({required: false})
    @IsOptional()
    id?: number;
    
    @IsNotEmpty()
    @ApiProperty()
    nom_destinataire:string;

    @IsNotEmpty()
    @ApiProperty()
    @IsEnum(StatusColis)
    status:string;
    
    @IsNotEmpty()
    @ApiProperty()
    details_colis: DetailColisUpdateDto[];    
}