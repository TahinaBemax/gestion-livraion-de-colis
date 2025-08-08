import { ApiProperty } from "@nestjs/swagger";

export class TypeUtilisateurSwaggerDto {
    @ApiProperty({example: "TYPE-USER-00001", description: "ID Type Utilisateur"})
    id:string;
    @ApiProperty({example: "Prestataire"})
    type:string;
}