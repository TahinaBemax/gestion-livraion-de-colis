import { Body, Controller, Delete, Get, Param, Post, Put, Query, UseGuards } from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from 'src/common/dto/create-user-dto';
import { User } from './user.entity';
import { JwtGuard } from 'src/common/guards/jwt/jwt.guard';
import { Roles } from 'src/common/decorators/roles.decorator';
import { UserRole } from 'src/common/enum/user-role.enum';
import { RolesGuard } from 'src/common/guards/roles.guard';

@Controller('users')
export class UserController {
    constructor(private readonly userService: UserService) {}

    @Post()
    @UseGuards(JwtGuard, RolesGuard)
    @Roles(UserRole.Admin)
    create(@Body() dto: CreateUserDto): Promise<User> {
        return this.userService.create(dto);
    }

    @Get()
    @UseGuards(JwtGuard, RolesGuard)
    findAll(): Promise<User[]> {
        return this.userService.findAll();
    }

    @Get('/filterBy')
    //@UseGuards(RolesGuard)
    //@Roles(UserRole.Admin)
    filterBy(@Query('nom') nom?:string, @Query('prenom') prenom?:string, @Query('role') role?:string, @Query('nomEntreprise') nomEntreprise?:string): Promise<User[]> {
        return this.userService.filterBy(nom, prenom, role, nomEntreprise);
    }

    @Get(":id")
    findById(@Param("id") id: number): Promise<User> {
        return this.userService.findById(id);
    }

    @Put()
    async update(user: User): Promise<User>{
        return this.userService.update(user);
    }

    @Put(":id")
    async activateUser( @Param("id") id: number): Promise<{ message: string }>{
        this.userService.activateUser(id);
        return Promise.resolve({ message: "Compte Utilisateur activé." });
    }

    @Delete(":id")
    async delete(@Param("id") id:number): Promise<{ message: string }>{
        this.userService.delete(id);
        return Promise.resolve({ message: "Compte Utilisateur activé." });
    }
}

