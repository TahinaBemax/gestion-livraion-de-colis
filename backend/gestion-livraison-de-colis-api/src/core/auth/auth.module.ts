import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AuthGuard, PassportModule } from '@nestjs/passport';
import { JwtStrategy } from './jwt.strategy';
import { UserModule } from 'src/modules/user/user.module';
import { APP_GUARD } from '@nestjs/core';

@Module({
  providers: [AuthService, JwtStrategy],
  controllers: [AuthController],
  imports: [
    UserModule,
    PassportModule,
    ConfigModule,
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
            expiresIn: config.get<string>('JWT_EXPIRES_IN') 
          }
        }
      },
    }),
  ],
  exports: [AuthService, JwtModule]
})

export class AuthModule {}
