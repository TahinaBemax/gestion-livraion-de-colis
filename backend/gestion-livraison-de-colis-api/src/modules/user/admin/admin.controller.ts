import { Body, Controller, Delete, Get, Param, Post, Put, Query } from '@nestjs/common';
import { UserService } from '../user.service';
import { Roles } from 'src/common/decorators/roles.decorator';
import { CreateUserDto } from 'src/common/dto/create-user-dto';
import { UserRole } from 'src/common/enum/user-role.enum';
import { User } from '../user.entity';
import { PrestataireCreateDto } from 'src/common/dto/prestataire/create-prestataire-dto';
import { Prestataire } from 'src/modules/prestataire/prestataire.entity';
import { PrestataireService } from 'src/modules/prestataire/prestataire.service';

@Controller('admin')
@Roles(UserRole.Admin)
export class AdminController {
    constructor(private readonly userService: UserService, private readonly prestataireService: PrestataireService){}

    @Post("/users")
    createUser(@Body() dto: CreateUserDto): Promise<User> {
        return this.userService.create(dto);
    }

    @Put("/users/:id/activate")
    async activateUser( @Param("id") id: number): Promise<{ message: string }>{
        this.userService.activateUser(id);
        return Promise.resolve({ message: "Compte Utilisateur activé." });
    }

    @Delete("/users/:id/desactivate")
    async desactivateUser(@Param("id") id:number): Promise<{ message: string }>{
        this.userService.delete(id);
        return Promise.resolve({ message: "Compte Utilisateur désactivé." });
    }

    @Put("/users")
    async update(user: User): Promise<User>{
        return this.userService.update(user);
    }

    @Get("/users")
    findAllUsers(): Promise<User[]> {
        return this.userService.findAll();
    }

    @Get('/users/filterBy')
    filterBy(@Query('nom') nom?:string, @Query('prenom') prenom?:string, @Query('role') role?:string, @Query('nomEntreprise') nomEntreprise?:string): Promise<User[]> {
        return this.userService.filterBy(nom, prenom, role, nomEntreprise);
    }

    
    /* --- PRESTATAIRE ---- */
    @Post("/prestataires")
    createPrestataire(@Body() data: PrestataireCreateDto): Promise<Prestataire> {
        return this.prestataireService.create(data);
    }
    
    @Get("/prestataires")
    findAllPrestataires() {
        return this.prestataireService.findAll();
    }

    @Get('/prestataires/filterBy')
    filterPrestataireUsersBy(@Query('nom') nom?:string, @Query('prenom') prenom?:string, @Query('nomEntreprise') nomEntreprise?:string): Promise<User[]> {
        return this.userService.prestataireUsersfilterBy(nom, prenom, nomEntreprise);
    }

    @Put("/prestataires")
    updatePrestataire(@Body() data: Prestataire){
        return this.prestataireService.update(data)
    }

    @Delete("/prestataires/:id/desactivate")
    desactivatePrestataireAccount(@Param('id') id:number) {
        return this.prestataireService.desactivate(id);
    }

    @Put("/prestataires/:id/activate")
    activate(@Param('id') id:number){
        return this.prestataireService.activate(id);
    }
}
