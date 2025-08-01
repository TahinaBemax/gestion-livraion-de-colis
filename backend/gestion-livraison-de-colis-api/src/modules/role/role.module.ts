import { Module } from '@nestjs/common';
import { RoleService } from './role.service';
import { Role } from './role.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TypeUtilisateurModule } from '../user/type-utilisateur/type-utilisateur.module';

@Module({
  providers: [RoleService, Role],
  exports: [Role, RoleService],
  imports: [TypeUtilisateurModule,TypeOrmModule.forFeature([Role])]
})
export class RoleModule {}
