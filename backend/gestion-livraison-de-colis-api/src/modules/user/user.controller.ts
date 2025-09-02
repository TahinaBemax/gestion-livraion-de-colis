import { Controller, Get, Param, ParseIntPipe, UseGuards, } from '@nestjs/common';
import { UserService } from './user.service';
import { User } from './user.entity';
import { ApiTags } from '@nestjs/swagger';
import { NotificationService } from '../notification/notification.service';
import { NotificationEntity } from '../notification/notification.entity';
import { SameUserGuard } from 'src/common/guards/same-user.guard';

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
    @UseGuards(SameUserGuard)
    findById(@Param("id", ParseIntPipe) id: number): Promise<User> {
        return this.userService.findById(id);
    }

    /* ------------------- NOTIFIATIONS -------------------------- */
    /**
     * LISTE DES NOTIFICATIONS DE L'UTILISATEUR 
     * @param id ID de l'utilisateur
     * @returns Liste Notification
     */
    @Get("/:id/notifications")
    @UseGuards(SameUserGuard)
    getNotifications(@Param("id", ParseIntPipe) id: number): Promise<NotificationEntity[]> {
        return this.notifService.findByUser(id);
    }
}

