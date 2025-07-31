import { Module } from '@nestjs/common';
import { RoleService } from './role.service';
import { Roles } from './role.entity';

@Module({
  providers: [RoleService],
  exports: [Roles, RoleService]
})
export class RoleModule {}
