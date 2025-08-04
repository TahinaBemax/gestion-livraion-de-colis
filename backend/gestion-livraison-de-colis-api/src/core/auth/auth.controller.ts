import { Public } from 'src/common/decorators/public.decorator';
import { AuthService } from './auth.service';
import { Body, Controller, Post, UnauthorizedException } from '@nestjs/common';

@Controller('auth')
export class AuthController {
    constructor(private authService: AuthService) {}

    @Public()
    @Post('login')
    async login(@Body() loginDto: {login:string, mot_de_passe: string}){
        const user = await this.authService.validateUser(loginDto.login, loginDto.mot_de_passe);
        
        if(!user) throw new UnauthorizedException("Login ou mot de passe incorrect!");
        return this.authService.login(user);
    }
}
