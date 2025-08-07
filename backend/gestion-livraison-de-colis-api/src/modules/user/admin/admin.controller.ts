import { Body, Controller, Delete, Get, HttpStatus, Param, Post, Put, Query } from '@nestjs/common';
import { UserService } from '../user.service';
import { Roles } from 'src/common/decorators/roles.decorator';
import { CreateUserDto } from 'src/common/dto/create-user-dto';
import { UserRole } from 'src/common/enum/user-role.enum';
import { User } from '../user.entity';
import { PrestataireCreateDto } from 'src/common/dto/prestataire/create-prestataire-dto';
import { Prestataire } from 'src/modules/prestataire/prestataire.entity';
import { PrestataireService } from 'src/modules/prestataire/prestataire.service';
import { LivreurService } from 'src/modules/livreur/livreur.service';
import { ApiBadRequestResponse, ApiBody, ApiCreatedResponse, ApiInternalServerErrorResponse, ApiNotFoundResponse, ApiOkResponse, ApiOperation, ApiParam, ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';
import { UserSwaggerDto } from 'src/common/swagger-dto/user/user-swagger-dto';
import { PrestataireSwaggerDto } from 'src/common/swagger-dto/prestataire/prestataire-swagger-dto';
import { LivreurSwaggerDto } from 'src/common/swagger-dto/livreur/livreur-swagger-dto';

@ApiTags("admin")
@Controller('admin')
@Roles(UserRole.Admin)
export class AdminController {
    constructor(
        private readonly userService: UserService, 
        private readonly prestataireService: PrestataireService,
        private readonly livreurService: LivreurService
    ){}

    @Post("/users")
    @ApiBody({type: CreateUserDto})
    @ApiOperation({summary: "Crée un utilisateur pour Tempo One ou pour un Prestataire"})
    @ApiCreatedResponse({type: UserSwaggerDto, description: "Utilisateur a été crée avec succés!"})
    @ApiBadRequestResponse({description: "Donnée invalid"})
    createUser(@Body() dto: CreateUserDto): Promise<User> {
        return this.userService.create(dto);
    }

    @Put("/users/:id/activate")
    @ApiParam({name: "id", description: "L'ID de l'utilisateur qu'on veut activé son compte."})
    @ApiOperation({summary: "Activé le compte d'un utilisateur donné."})
    @ApiCreatedResponse({description: "Compte activé avec succés!", type: "Compte Utilisateur activé"})
    @ApiNotFoundResponse({description: "Utilisateur Introuvable"})
    async activateUser( @Param("id") id: number): Promise<{ message: string }>{
        this.userService.activateUser(id);
        return Promise.resolve({ message: "Compte Utilisateur activé." });
    }

    @Put("/users/:id/desactivate")
    @ApiParam({name: "id", description: "L'ID de l'utilisateur qu'on veut désactivé son compte."})
    @ApiOperation({summary: "Désactivé le compte d'un utilisateur donné."})
    @ApiCreatedResponse({description: "Compte desactivé avec succés!", type: "Compte Utilisateur désactivé"})
    @ApiNotFoundResponse({description: "Utilisateur Introuvable"})
    @ApiInternalServerErrorResponse({description: "Internal server error"})
    async desactivateUser(@Param("id") id:number): Promise<{ message: string }>{
        this.userService.delete(id);
        return Promise.resolve({ message: "Compte Utilisateur désactivé." });
    }

    @Put("/users")
    @ApiBody({type: UserSwaggerDto})
    @ApiOperation({summary: "Modifier un utilisateur"})
    @ApiCreatedResponse({description: "Compte modifié avec succés!", type: UserSwaggerDto})
    @ApiNotFoundResponse({description: "Utilisateur Introuvable"})
    @ApiInternalServerErrorResponse({description: "Internal server error"})
    async update(user: User): Promise<User>{
        return this.userService.update(user);
    }

    @Get("/users")
    @ApiOperation({summary: "Lister les utilisateurs actives"})
    @ApiOkResponse({description: "Ok", type: [UserSwaggerDto]})
    @ApiInternalServerErrorResponse({description: "Internal server error"})
    findAllUsers(): Promise<User[]> {
        return this.userService.findAll();
    }

    @Get('/users/filterBy')
    @ApiOperation({summary: "Filtré les utilisateurs par prénom, nom, rôle et le nom de l'entreprise"})
    @ApiOkResponse({description: "Ok", type: [UserSwaggerDto]})
    @ApiInternalServerErrorResponse({description: "Internal server error"})
    filterBy(@Query('nom') nom?:string, @Query('prenom') prenom?:string, @Query('role') role?:string, @Query('nomEntreprise') nomEntreprise?:string): Promise<User[]> {
        return this.userService.filterBy(nom, prenom, role, nomEntreprise);
    }

    
    /* --- PRESTATAIRE ---- */
    @Post("/prestataires")
    @ApiBody({type: PrestataireCreateDto})
    @ApiOperation({summary: "Crée un prestataire"})
    @ApiOkResponse({description: "Ok", type: PrestataireSwaggerDto})
    @ApiInternalServerErrorResponse({description: "Internal server error"})
    @ApiBadRequestResponse({description: "Données invalides, Réessayé"})
    createPrestataire(@Body() data: PrestataireCreateDto): Promise<Prestataire> {
        return this.prestataireService.create(data);
    }
    
    @Get("/prestataires")
    @ApiOperation({summary: "Lister les prestataires"})
    @ApiOkResponse({description: "Ok", type: [PrestataireSwaggerDto]})
    @ApiInternalServerErrorResponse({description: "Internal server error"})
    findAllPrestataires() {
        return this.prestataireService.findAll();
    }

    @Get('/prestataires/filterBy')
    @ApiOperation({summary: "Filtré les prestataires par nom, prenom et nom de l'entreprise"})
    @ApiOkResponse({description: "Ok", type: [PrestataireSwaggerDto]})
    @ApiInternalServerErrorResponse({description: "Internal server error"})
    filterPrestataireUsersBy(@Query('nom') nom?:string, @Query('prenom') prenom?:string, @Query('nomEntreprise') nomEntreprise?:string): Promise<User[]> {
        return this.userService.prestataireUsersfilterBy(nom, prenom, nomEntreprise);
    }

    @Put("/prestataires")
    @ApiBody({type: PrestataireSwaggerDto})
    @ApiOperation({summary: "Modifié un prestataire"})
    @ApiCreatedResponse({description: "Prestataire modifié avec succés", type: PrestataireSwaggerDto})
    @ApiInternalServerErrorResponse({description: "Internal server error"})
    @ApiBadRequestResponse({description: "Données invalides, Réessayé"})
    updatePrestataire(@Body() data: Prestataire){
        return this.prestataireService.update(data)
    }


    @Put("/prestataires/:id/desactivate")
    @ApiParam({name: "id", description: "L'ID du prestataire qu'on veut désactivé le compte."})
    @ApiOperation({summary: "Désactivé le compte d'un utilisateur donné."})
    @ApiCreatedResponse({description: "Compte desactivé avec succés!", type: "Compte prestataire désactivé"})
    @ApiNotFoundResponse({description: "Prestataire Introuvable"})
    @ApiInternalServerErrorResponse({description: "Internal server error"})
    desactivatePrestataireAccount(@Param('id') id:number) {
        return this.prestataireService.desactivate(id);
    }

    @Put("/prestataires/:id/activate")
    @ApiParam({name: "id", description: "L'ID du prestataire qu'on veut activé le compte."})
    @ApiOperation({summary: "activé le compte d'un utilisateur donné."})
    @ApiCreatedResponse({description: "Compte desactivé avec succés!", type: "Compte prestataire activé"})
    @ApiNotFoundResponse({description: "Prestataire Introuvable"})
    @ApiInternalServerErrorResponse({description: "Internal server error"})
    activate(@Param('id') id:number){
        return this.prestataireService.activate(id);
    }

    /* LIVREUR*/
    @Put("/livreurs")
    @ApiOperation({summary: "Lister tous les livreurs"})
    @ApiOkResponse({description: "Ok", type: [LivreurSwaggerDto]})
    @ApiInternalServerErrorResponse({description: "Internal server error"})
    findLivreurs(){
        return this.livreurService.findAllLivreurs();
    }
}
