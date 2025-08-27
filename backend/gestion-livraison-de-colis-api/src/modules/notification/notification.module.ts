import { Module } from '@nestjs/common';
import { NotificationService } from './notification.service';
import { NotificationController } from './notification.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { NotificationEntity } from './notification.entity';
import { User } from '../user/user.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      NotificationEntity,
      User
    ])
  ],
  providers: [NotificationService],
  controllers: [NotificationController],
  exports: [NotificationService]
})
export class NotificationModule {}
