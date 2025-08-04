import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { UserModule } from 'src/modules/user/user.module';
import { PassportModule } from '@nestjs/passport';
import { JwtGuard } from 'src/common/guards/jwt/jwt.guard';
import { RolesGuard } from 'src/common/guards/roles.guard';

@Module({
  providers: [AuthService, JwtGuard, RolesGuard],
  controllers: [AuthController],
  imports: [
    PassportModule,
    ConfigModule,
    UserModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => {
        const secret = config.get<string>("JWT_SECRET");

        if(!secret) {
          throw new Error('JWT_SECRET environment variable is not set');
        }
        return {
          secret: secret,
          signOptions: { 
            expiresIn: config.get<string>('JWT_EXPIRES_IN') || '1h' 
          }
        }
      },
    }),
  ],
  exports: [AuthService, JwtGuard, RolesGuard, JwtModule]
})

export class AuthModule {}
