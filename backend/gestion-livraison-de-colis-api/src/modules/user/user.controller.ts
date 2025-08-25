import { Controller, Get, Param, } from '@nestjs/common';
import { UserService } from './user.service';
import { User } from './user.entity';
import { ApiTags } from '@nestjs/swagger';

@Controller('users')
@ApiTags("user")
export class UserController {
    constructor(private readonly userService: UserService) {}

    /**
     * RECUPERER UN UTILISATEUR PAR SON ID
     * @param id ID de l'utilisateur
     * @returns Utilisateur
     */
    @Get("/:id/profile")
    findById(@Param("id") id: number): Promise<User> {
        return this.userService.findById(id);
    }
}

