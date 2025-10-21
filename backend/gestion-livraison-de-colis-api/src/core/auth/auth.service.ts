import { UserService } from './../../modules/user/user.service';
import { BadRequestException, ForbiddenException, Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { LoginResponse } from 'src/common/dto/auth/login-response-dto';
import { User } from 'src/modules/user/user.entity';
import { TypeEvenementEnum } from 'src/common/enum/type-evenement.enum';
import { TypeUtilisateur } from 'src/common/enum/type-utilisateur.enum';
@Injectable()
export class AuthService {
    constructor
    (
        private readonly userService: UserService, 
        private readonly jwtService: JwtService
    ){}

    async validateUser(login: string, password: string): Promise<User|null> {
        const user = await this.userService.findByLogin(login);
        if(!user.est_active) throw new ForbiddenException("Vous n'êtes pas autorisé à s'authentifier car votre compte est désactivé. Veuillez conctacter l'admin.");

        if(user && await bcrypt.compare(password, user.mot_de_passe)){
            return user;
        }

        return null;
    }

    async login(user: User): Promise<LoginResponse> {
        const prest = await user.prestataire;
        const livreur = await user.livreur;
        var payload;

        if(user.type_utilisateur.id_type_utilisateur === TypeUtilisateur.Livreur){
            payload = {
                username: user.adresse_email, 
                sub: user.id_utilisateur, 
                role: user.role?.id,
                idLivreur: livreur?.id_livreur,
                type_utilisateur: user.type_utilisateur.id_type_utilisateur,
                prestataire: prest?.id_prestataire
            };
        } else {
            payload = {
                username: user.adresse_email, 
                sub: user.id_utilisateur, 
                role: user.role?.id,
                idLivreur: undefined,
                type_utilisateur: user.type_utilisateur.id_type_utilisateur,
                prestataire: prest?.id_prestataire
            };
        }

        const access_token = this.jwtService.sign(payload);
        const loginReponse: LoginResponse = new LoginResponse();
        
        loginReponse.access_token = access_token;
        const { 
            mot_de_passe, 
            est_active,  
            notifications_envoye,
            notifications_recu,
            prestataire,
            ...result
        } = user;

        loginReponse.user = result;

        return loginReponse;
    }
}
