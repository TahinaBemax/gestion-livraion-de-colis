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
import { PrestataireService } from '../prestataire/prestataire.service';
import { LivreurModule } from '../livreur/livreur.module';
import { EmailService } from 'src/core/email/email.service';
import { NotificationModule } from '../notification/notification.module';

@Module({
  providers: [
    UserService, 
    UserMapper, 
    PrestataireService,
    EmailService
  ],
  controllers: [
    UserController, 
  ],
  imports: [
    TypeUtilisateurModule,
    forwardRef(() => LivreurModule),
    forwardRef(() => NotificationModule),
    TypeOrmModule.forFeature([
      User, 
      TypeUtilisateur, 
      Role, 
      Prestataire
    ]),
  ],
  exports:[
    UserService, 
    UserMapper, 
    UserModule
  ]
})
export class UserModule {}
