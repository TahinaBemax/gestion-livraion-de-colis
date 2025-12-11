import { Module, forwardRef } from '@nestjs/common';
import { NotificationService } from './notification.service';
import { NotificationController } from './notification.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { NotificationEntity } from './notification.entity';
import { User } from '../user/user.entity';
import { NotificationGateway } from './notification.gateway';
import { LivreurModule } from '../livreur/livreur.module';
import { UserModule } from '../user/user.module';
import { ProblemLivraisonHandler } from './events/problem-livraison-handler.service';
import { ProblemColisHandler } from './events/problem-colis-handler.service';
import { UserNotificationHandler } from './events/user-notification-handler.service';
import { LivraisonsModule } from '../livraisons/livraisons.module';
import { ColisModule } from '../colis/colis.module';

@Module({
  imports: [
    forwardRef(() => UserModule),
    forwardRef(() => LivreurModule),
    forwardRef(() => LivraisonsModule),
    forwardRef(() => ColisModule),
    TypeOrmModule.forFeature([
      NotificationEntity,
      User
    ])
  ],
  providers: [
    NotificationService,
    NotificationGateway,
    ProblemLivraisonHandler,
    ProblemColisHandler,
    UserNotificationHandler
  ],
  controllers: [NotificationController],
  exports: [NotificationService]
})
export class NotificationModule {}
