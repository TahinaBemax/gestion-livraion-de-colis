import { LoginDto } from '../../common/dto/auth/login-dto';
import { Public } from 'src/common/decorators/public.decorator';
import { AuthService } from './auth.service';
import { Body, Controller, HttpStatus, Param, Post, Query, UnauthorizedException } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBody, ApiCreatedResponse } from '@nestjs/swagger';
import { LoginResponse } from 'src/common/dto/auth/login-response-dto';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
    constructor(private authService: AuthService) {}

    @Public()
    @Post('login')
        @ApiOperation({summary: "Authentication"})
        @ApiResponse({status: HttpStatus.UNAUTHORIZED, description: "Le login ou mot de passe incorrect!"})
        @ApiBody({ type: LoginDto, description: 'Login credentials'})
    async login(@Body() loginDto: LoginDto){
        const user = await this.authService.validateUser(loginDto.login, loginDto.mot_de_passe);
        
        if(!user) throw new UnauthorizedException("Login ou mot de passe incorrect!");
        return await this.authService.login(user);
    }
}
