import { ApiProperty } from "@nestjs/swagger";

export class LoginResponse {
    @ApiProperty({description: "Json Web Token"})
    access_token: string;

    @ApiProperty({description: "Information de l'utilisateur authentifié."})
    user: any
}