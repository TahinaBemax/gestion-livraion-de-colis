import { Body, Controller, Delete, Get, Param, Post, Put, Query, UseGuards } from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from 'src/common/dto/create-user-dto';
import { User } from './user.entity';
import { AuthGuard } from '@nestjs/passport';
import { Roles } from 'src/common/decorators/roles.decorator';
import { UserRole } from 'src/common/enum/user-role.enum';

@Controller('users')
export class UserController {
    constructor(private readonly userService: UserService) {}

    @Post()
    @Roles(UserRole.Admin)
    create(@Body() dto: CreateUserDto): Promise<User> {
        return this.userService.create(dto);
    }

    @Get()
    @Roles(UserRole.Admin)
    findAll(): Promise<User[]> {
        return this.userService.findAll();
    }

    @Get('/filterBy')
    filterBy(@Query('nom') nom?:string, @Query('prenom') prenom?:string, @Query('role') role?:string, @Query('nomEntreprise') nomEntreprise?:string): Promise<User[]> {
        return this.userService.filterBy(nom, prenom, role, nomEntreprise);
    }

    @Get('prestataires/filterBy')
    filterPrestataireUsersBy(@Query('nom') nom?:string, @Query('prenom') prenom?:string, @Query('nomEntreprise') nomEntreprise?:string): Promise<User[]> {
        return this.userService.prestataireUsersfilterBy(nom, prenom, nomEntreprise);
    }

    @Get(":id")
    @Roles(UserRole.Admin)
    findById(@Param("id") id: number): Promise<User> {
        return this.userService.findById(id);
    }

    @Put()
    @Roles(UserRole.Admin)
    async update(user: User): Promise<User>{
        return this.userService.update(user);
    }

    @Put(":id")
    @Roles(UserRole.Admin)
    async activateUser( @Param("id") id: number): Promise<{ message: string }>{
        this.userService.activateUser(id);
        return Promise.resolve({ message: "Compte Utilisateur activé." });
    }

    @Delete(":id")
    @Roles(UserRole.Admin)
    async delete(@Param("id") id:number): Promise<{ message: string }>{
        this.userService.delete(id);
        return Promise.resolve({ message: "Compte Utilisateur activé." });
    }
}

