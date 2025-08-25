import { EmailService } from './../../../core/email/email.service';
import { Body, Controller, Get, Param, ParseIntPipe, Post, Put, Query } from '@nestjs/common';
import { UserService } from '../user.service';
import { Roles, UserTypes } from 'src/common/decorators/roles.decorator';
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
import { PrestataireUpdateDto } from 'src/common/dto/prestataire/update-prestataire-dto';
import { TypeUtilisateur } from 'src/common/enum/type-utilisateur.enum';
import { UpdateUserDto } from 'src/common/dto/update-user-dto';

@ApiTags("admin")
@Controller('admin')
@Roles(UserRole.Admin)
@UserTypes(TypeUtilisateur.TempoOne)
export class AdminController {
    constructor(
        private readonly userService: UserService, 
        private readonly prestataireService: PrestataireService,
        private readonly emailService: EmailService
    ){}

    /* --- USER --- */
    @Get("/users/restauration-mot-de-passe")
    passwordReset(@Query("mail") mail:string){
        return this.emailService.sendPasswordReset(mail);
    }

        /**
         * CREATION UTILISATEUR INTERNE TEMPO ONE
         * @param dto Data de création d'un utilisateur
         * @returns Utilisateur créé
         */
    @Post("/users")
    @ApiBody({type: CreateUserDto})
    @ApiOperation({summary: "Crée un utilisateur pour Tempo One"})
    @ApiCreatedResponse({type: UserSwaggerDto, description: "Utilisateur a été crée avec succés!"})
    @ApiBadRequestResponse({description: "Données invalids"})
    createUser(@Body() dto: CreateUserDto): Promise<User> {
        return this.userService.saveInterneUser(dto);
    }

        /**
         * ACTIVATION COMPTE UTILISATEUR
         * @param id ID de l'utilisateur
         * @returns MESSAGE de confirmation
         */
    @Put("/users/:id/activate")
    @ApiParam({name: "id", description: "L'ID de l'utilisateur qu'on veut activé son compte."})
    @ApiOperation({summary: "Activé le compte d'un utilisateur donné."})
    @ApiCreatedResponse({description: "Compte activé avec succés!", type: "Compte Utilisateur activé"})
    @ApiNotFoundResponse({description: "Utilisateur Introuvable"})
    async activateUser( @Param("id") id: number): Promise<{ message: string }>{
        this.userService.activateUser(id);
        return Promise.resolve({ message: "Compte Utilisateur activé." });
    }

        /**
        * DESACTIVATION COMPTE UTILISATEUR
        * @param id ID de l'utilisateur
        * @returns MESSAGE de confirmation
        */
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

        /**
         *  MODIFICATION UTILISATEUR
         * @param id ID de l'utilisateur
         * @param user Utilisateur avec les nouvelles données
         * @returns Utilisateur modifié
         */
    @Put("/users/:id")
    @ApiBody({type: UpdateUserDto})
    @ApiOperation({summary: "Modifier un utilisateur"})
    @ApiCreatedResponse({description: "Compte modifié avec succés!", type: UserSwaggerDto})
    @ApiNotFoundResponse({description: "Utilisateur Introuvable"})
    @ApiInternalServerErrorResponse({description: "Internal server error"})
    async update(@Param("id", ParseIntPipe) id: number,@Body() user: UpdateUserDto): Promise<User>{
        return this.userService.updateUser(id, user);
    }

        /**
         * LISTE DES UTILISATEURS ACTIVES
         * @returns Liste des utilisateurs actives
         */
    @Get("/users")
    @ApiOperation({summary: "Lister les utilisateurs actives"})
    @ApiOkResponse({description: "Ok", type: [UserSwaggerDto]})
    @ApiInternalServerErrorResponse({description: "Internal server error"})
    findAllUsers(): Promise<User[]> {
        return this.userService.findAll();
    }

        /**
         * LISTE DES UTILISATEURS TEMPO ONE ACTIVES FILTRE PAR PRENOM, NOM, ROLE ET ENTREPRISE
         * @param nom 
         * @param prenom 
         * @param role 
         * @param nomEntreprise 
         * @returns Liste des utilisateurs filtrés
         */
    @Get('/users/filterBy')
    @ApiOperation({summary: "Filtré les utilisateurs par prénom, nom, rôle et le nom de l'entreprise"})
    @ApiOkResponse({description: "Ok", type: [UserSwaggerDto]})
    @ApiInternalServerErrorResponse({description: "Internal server error"})
    filterBy(@Query('nom') nom?:string, @Query('prenom') prenom?:string, @Query('role') role?:string, @Query('nomEntreprise') nomEntreprise?:string): Promise<User[]> {
        return this.userService.filterBy(nom, prenom, role, nomEntreprise);
    }
    /* ---- ----- ----- ----- ----/

    
    /* --- PRESTATAIRE ---- */
        /**
         * CREATION PRESTATAIRE
         * @param data Data de création d'un prestataire
         * @returns Prestataire créé
         */
    @Post("/prestataires")
    @ApiBody({type: PrestataireCreateDto})
    @ApiOperation({summary: "Crée un prestataire"})
    @ApiOkResponse({description: "Ok", type: PrestataireSwaggerDto})
    @ApiInternalServerErrorResponse({description: "Internal server error"})
    @ApiBadRequestResponse({description: "Données invalides, Réessayé"})
    createPrestataire(@Body() data: PrestataireCreateDto): Promise<Prestataire> {
        return this.prestataireService.create(data);
    }
    
        /**
         * LISTE DES PRESTATAIRES
         * @returns Liste des prestataires
         */
    @Get("/prestataires")
    @ApiOperation({summary: "Lister les prestataires"})
    @ApiOkResponse({description: "Ok", type: [PrestataireSwaggerDto]})
    @ApiInternalServerErrorResponse({description: "Internal server error"})
    findAllPrestataires() {
        return this.prestataireService.findAll();
    }

        /**
         * LISTE DES PRESTATAIRES FILTRE PAR PRENOM, NOM ET ENTREPRISE
         * @param nom 
         * @param prenom 
         * @param nomEntreprise 
         * @returns Liste des prestataires filtrés
         */
    @Get('/prestataires/filterBy')
    @ApiOperation({summary: "Filtré les prestataires par nom, prenom et nom de l'entreprise"})
    @ApiOkResponse({description: "Ok", type: [PrestataireSwaggerDto]})
    @ApiInternalServerErrorResponse({description: "Internal server error"})
    filterPrestataireUsersBy(@Query('nom') nom?:string, @Query('prenom') prenom?:string, @Query('nomEntreprise') nomEntreprise?:string): Promise<User[]> {
        return this.userService.prestataireUsersfilterBy(undefined, nom, prenom, nomEntreprise);
    }

        /**
         * MODIFICATION PRESTATAIRE
         * @param id ID du prestataire
         * @param data Prestataire avec les nouvelles données
         * @returns Prestataire modifié
         */
    @Put("/prestataires/:id")
    @ApiBody({type: PrestataireSwaggerDto})
    @ApiOperation({summary: "Modifié un prestataire"})
    @ApiCreatedResponse({description: "Prestataire modifié avec succés", type: PrestataireSwaggerDto})
    @ApiInternalServerErrorResponse({description: "Internal server error"})
    @ApiBadRequestResponse({description: "Données invalides, Réessayé"})
    updatePrestataire(@Param("id", ParseIntPipe) id: number, @Body() data: PrestataireUpdateDto){
        return this.prestataireService.update(id, data)
    }


        /**
         * DESACTIVATION COMPTE PRESTATAIRE
         * @param id ID du prestataire
         * @returns MESSAGE de confirmation
         */
    @Put("/prestataires/:id/desactivate")
    @ApiParam({name: "id", description: "L'ID du prestataire qu'on veut désactivé le compte."})
    @ApiOperation({summary: "Désactivé le compte d'un utilisateur donné."})
    @ApiCreatedResponse({description: "Compte desactivé avec succés!", type: "Compte prestataire désactivé"})
    @ApiNotFoundResponse({description: "Prestataire Introuvable"})
    @ApiInternalServerErrorResponse({description: "Internal server error"})
    desactivatePrestataireAccount(@Param('id') id:number) {
        return this.prestataireService.desactivate(id);
    }

        /**
         * ACTIVATION COMPTE PRESTATAIRE
         * @param id ID du prestataire
         * @returns MESSAGE de confirmation
         */
    @Put("/prestataires/:id/activate")
    @ApiParam({name: "id", description: "L'ID du prestataire qu'on veut activé le compte."})
    @ApiOperation({summary: "activé le compte d'un utilisateur donné."})
    @ApiCreatedResponse({description: "Compte desactivé avec succés!", type: "Compte prestataire activé"})
    @ApiNotFoundResponse({description: "Prestataire Introuvable"})
    @ApiInternalServerErrorResponse({description: "Internal server error"})
    activatePrestataireAccount(@Param('id') id:number){
        return this.prestataireService.activate(id);
    }

    /* ---- ----- ----- ----- ---- */
}
