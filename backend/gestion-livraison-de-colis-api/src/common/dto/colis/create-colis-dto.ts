import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsOptional } from "class-validator";
import { DetailColisDto } from "./detail-colis-dto";

export class ColisCreateDto{    
    @IsNotEmpty()
    @ApiProperty({type: [DetailColisDto]})
    details_colis: DetailColisDto[];
}