import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { TypeUtilisateurModule } from './type-utilisateur/type-utilisateur.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './user.entity';
import { UserMapper } from './utils/user.mapper';
import { TypeUtilisateur } from './type-utilisateur/type-utilisateur.entity';
import { Role } from '../role/role.entity';
import { Prestataire } from '../prestataire/prestataire.entity';
import { JwtService } from '@nestjs/jwt';

@Module({
  providers: [UserService, UserMapper, JwtService],
  controllers: [UserController],
  imports: [
    TypeUtilisateurModule,
    TypeOrmModule.forFeature([User, TypeUtilisateur, Role, Prestataire])
  ],
  exports:[UserService, UserMapper]
})
export class UserModule {}
