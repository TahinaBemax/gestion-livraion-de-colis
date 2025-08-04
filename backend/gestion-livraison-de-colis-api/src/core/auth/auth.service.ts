import { UserService } from './../../modules/user/user.service';
import { Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
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

    async login(user: any) {
        const payload = {
            username: user.login, 
            sub: user.id_utilisateur, 
            role: user.role?.id
        };

        return {
            access_token: this.jwtService.sign(payload),
        }
    }
}
