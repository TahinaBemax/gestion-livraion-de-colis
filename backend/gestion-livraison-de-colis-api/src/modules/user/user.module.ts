import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { TypeUtilisateurModule } from './type-utilisateur/type-utilisateur.module';

@Module({
  providers: [UserService],
  controllers: [UserController],
  imports: [TypeUtilisateurModule]
})
export class UserModule {}
