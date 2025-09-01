import { Module, forwardRef } from '@nestjs/common';
import { NotificationService } from './notification.service';
import { NotificationController } from './notification.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { NotificationEntity } from './notification.entity';
import { User } from '../user/user.entity';
import { NotificationGateway } from './notification.gateway';
import { LivreurModule } from '../livreur/livreur.module';
import { UserModule } from '../user/user.module';

@Module({
  imports: [
    forwardRef(() => UserModule),
    LivreurModule,
    TypeOrmModule.forFeature([
      NotificationEntity,
      User
    ])
  ],
  providers: [
    NotificationService,
    NotificationGateway
  ],
  controllers: [NotificationController],
  exports: [NotificationService]
})
export class NotificationModule {}
