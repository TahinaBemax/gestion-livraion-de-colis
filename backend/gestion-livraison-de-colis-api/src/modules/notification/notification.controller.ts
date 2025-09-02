import { Controller, Delete, Get, Param, ParseIntPipe, Query } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { NotificationService } from './notification.service';

@Controller('notifications')
@ApiTags("Notification")
export class NotificationController {
    constructor(private readonly notifService: NotificationService){}

    @Get("/:id")
    getById(@Param("id", ParseIntPipe) id: number){
        return this.notifService.findById(id);
    }

    @Delete("/:id")
    delete(@Param("id", ParseIntPipe) id: number){
        return this.notifService.delete(id);
    }
}
