import { forwardRef, Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { TypeUtilisateurModule } from './type-utilisateur/type-utilisateur.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './user.entity';
import { UserMapper } from './utils/user.mapper';
import { TypeUtilisateur } from './type-utilisateur/type-utilisateur.entity';
import { Role } from '../role/role.entity';
import { Prestataire } from '../prestataire/prestataire.entity';
import { AuthModule } from 'src/core/auth/auth.module';
import { AdminController } from './admin/admin.controller';
import { PrestataireService } from '../prestataire/prestataire.service';

@Module({
  providers: [UserService, UserMapper, PrestataireService],
  controllers: [UserController, AdminController],
  imports: [
    TypeUtilisateurModule,
    TypeOrmModule.forFeature([User, TypeUtilisateur, Role, Prestataire])
  ],
  exports:[UserService, UserMapper]
})
export class UserModule {}
