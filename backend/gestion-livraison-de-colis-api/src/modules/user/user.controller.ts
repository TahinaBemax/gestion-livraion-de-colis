import { Body, Controller, Get, Param, ParseIntPipe, Post, } from '@nestjs/common';
import { UserService } from './user.service';
import { User } from './user.entity';
import { ApiTags } from '@nestjs/swagger';
import { NotificationCreateDto } from 'src/common/dto/notification/notification-create-dto';
import { NotificationService } from '../notification/notification.service';
import { NotificationEntity } from '../notification/notification.entity';

@Controller('users')
@ApiTags("user")
export class UserController {
    constructor(
        private readonly userService: UserService,
        private readonly notifService: NotificationService
    ) {}

    /**
     * RECUPERER UN UTILISATEUR PAR SON ID
     * @param id ID de l'utilisateur
     * @returns Utilisateur
     */
    @Get("/:id/profile")
    findById(@Param("id", ParseIntPipe) id: number): Promise<User> {
        return this.userService.findById(id);
    }

    /* ------------------- NOTIFIATIONS -------------------------- */
    /**
     * ENVOYER UN NOTIFICATION VERS UN UTILISATEUR 
     * @param id ID de l'utilisateur
     * @returns Notification enregistré
     */
    @Post("/:id/notifications")
    sendNotification(@Param("id", ParseIntPipe) id: number, @Body() dto: NotificationCreateDto): Promise<NotificationEntity> {
        return this.notifService.save(id, dto);
    }

    /**
     * LISTE DES NOTIFICATIONS DE L'UTILISATEUR 
     * @param id ID de l'utilisateur
     * @returns Liste Notification
     */
    @Get("/:id/notifications")
    getNotifications(@Param("id", ParseIntPipe) id: number): Promise<NotificationEntity[]> {
        return this.notifService.findByUser(id);
    }
}

