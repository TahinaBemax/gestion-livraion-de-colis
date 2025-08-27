import { ApiProperty } from "@nestjs/swagger";
import { IsArray, IsNotEmpty } from "class-validator";

export class NotificationCreateDto {
    @IsNotEmpty()
    @ApiProperty()
    titre: string;
    
    @IsNotEmpty()
    @ApiProperty()
    message: string;
    
    @IsNotEmpty()
    @ApiProperty()
    @IsArray()
    id_receveurs: number[];
}