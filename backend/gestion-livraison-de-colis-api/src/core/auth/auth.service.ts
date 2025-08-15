import { UserService } from './../../modules/user/user.service';
import { BadRequestException, Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { LoginResponse } from 'src/common/dto/auth/login-response-dto';
@Injectable()
export class AuthService {
    constructor
    (
        private readonly userService: UserService, 
        private readonly jwtService: JwtService
    ){}

    async validateUser(login: string, password: string): Promise<any> {
        const user = await this.userService.findByLogin(login);

        if(user && await bcrypt.compare(password, user.mot_de_passe)){
            const { mot_de_passe, ...result} = user;
            return result;
        }

        return null;
    }

    async validateQRCodeLogin(qrCodeData: string): Promise<any> {
        if(!qrCodeData) throw new BadRequestException("Donnée invalide");
        const [login, password] = qrCodeData.split(':');
        const user = await this.userService.findByLogin(login);

        if (user && user.mot_de_passe === password) {
            const { mot_de_passe, ...result} = user;
            return result;
        }
        return null;
    }

    login(user: any): LoginResponse {
        const payload = {
            username: user.login, 
            sub: user.id_utilisateur, 
            role: user.role?.id
        };

        const access_token = this.jwtService.sign(payload);
        const loginReponse: LoginResponse = new LoginResponse();
        
        loginReponse.access_token = access_token;
        loginReponse.user = user;

        return loginReponse;
    }
}
