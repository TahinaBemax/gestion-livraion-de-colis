import { Body, Controller, Delete, Get, Param, ParseIntPipe, Post, Put, Query, UseGuards, } from '@nestjs/common';
import { UserService } from './user.service';
import { User } from './user.entity';
import { ApiBadRequestResponse, ApiBody, ApiCreatedResponse, ApiInternalServerErrorResponse, ApiNotFoundResponse, ApiOkResponse, ApiOperation, ApiParam, ApiTags } from '@nestjs/swagger';
import { NotificationService } from '../notification/notification.service';
import { NotificationEntity } from '../notification/notification.entity';
import { SameUserGuard } from 'src/common/guards/same-user.guard';
import { EmailService } from 'src/core/email/email.service';
import { CreateUserDto } from 'src/common/dto/create-user-dto';
import { UpdateUserDto } from 'src/common/dto/update-user-dto';
import { UserSwaggerDto } from 'src/common/swagger-dto/user/user-swagger-dto';
import { Roles, UserTypes } from 'src/common/decorators/roles.decorator';
import { UserRole } from 'src/common/enum/user-role.enum';
import { TypeUtilisateur } from 'src/common/enum/type-utilisateur.enum';

@Controller('users')
@ApiTags("User")
@Roles(UserRole.Admin)
@UserTypes(TypeUtilisateur.TempoOne)
export class UserController {
    constructor(
        private readonly userService: UserService,
        private readonly notifService: NotificationService,
        private readonly emailService: EmailService
    ) {}

    /* --- USER --- */
        /**
         * CREATION UTILISATEUR INTERNE TEMPO ONE
         * @param dto Data de création d'un utilisateur
         * @returns Utilisateur créé
         */
    @Post()
        @ApiBody({type: CreateUserDto})
        @ApiOperation({summary: "Créer un utilisateur(Admin ou Interne) pour Tempo One"})
        @ApiCreatedResponse({type: UserSwaggerDto, description: "Utilisateur a été crée avec succés!"})
        @ApiBadRequestResponse({description: "Données invalids"})
    createUser(@Body() dto: CreateUserDto): Promise<User> {
        return this.userService.saveInterneUser(dto);
    }

        /**
         *  MODIFICATION UTILISATEUR
         * @param id ID de l'utilisateur
         * @param user Utilisateur avec les nouvelles données
         * @returns Utilisateur modifié
         */
    @Put("/:id")
        @Roles(UserRole.Admin, UserRole.ResponsableExploitation, UserRole.User)
        @UserTypes(TypeUtilisateur.Livreur, TypeUtilisateur.Prestataire, TypeUtilisateur.TempoOne)
        @ApiBody({type: UpdateUserDto})
        @ApiOperation({summary: "Modifier un utilisateur"})
        @ApiCreatedResponse({description: "Compte modifié avec succés!", type: UserSwaggerDto})
        @ApiNotFoundResponse({description: "Utilisateur Introuvable"})
    async update(@Param("id", ParseIntPipe) id: number,@Body() user: UpdateUserDto): Promise<User>{
        return this.userService.updateUser(id, user);
    }
        /**
         * ACTIVATION COMPTE UTILISATEUR
         * @param id ID de l'utilisateur
         * @returns MESSAGE de confirmation
         */
    @Put("/:id/activate")
        @ApiParam({name: "id", description: "L'ID de l'utilisateur qu'on veut activé son compte."})
        @ApiOperation({summary: "Activé le compte d'un utilisateur donné."})
        @ApiCreatedResponse({description: "Compte activé avec succés!", type: "Compte Utilisateur activé"})
        @ApiNotFoundResponse({description: "Utilisateur Introuvable"})
    async activateUser( @Param("id") id: number): Promise<string>{
        this.userService.activateUser(id);
        return Promise.resolve("Compte activé!");
    }

        /**
        * DESACTIVATION COMPTE UTILISATEUR
        * @param id ID de l'utilisateur
        * @returns MESSAGE de confirmation
        */
    @Delete("/:id")
        @Roles(UserRole.Admin, UserRole.ResponsableExploitation, UserRole.User)
        @UserTypes(TypeUtilisateur.Livreur, TypeUtilisateur.Prestataire, TypeUtilisateur.TempoOne)
        @ApiParam({name: "id", description: "L'ID de l'utilisateur qu'on veut désactivé son compte."})
        @ApiOperation({summary: "Désactivé le compte d'un utilisateur donné."})
        @ApiCreatedResponse({description: "Compte desactivé avec succés!", type: "Compte Utilisateur désactivé"})
        @ApiNotFoundResponse({description: "Utilisateur Introuvable"})
    async desactivateUser(@Param("id") id:number): Promise<string>{
        this.userService.delete(id);
        return Promise.resolve( "Compte désactivé.");
    }


        /**
         * LISTE DES UTILISATEURS ACTIVES DU TEMPO ONE
         * @returns Liste des utilisateurs actives
         */
    @Get()
        @ApiOperation({summary: "Lister les utilisateurs actives de Tempo One"})
        @ApiOkResponse({description: "Ok", type: [UserSwaggerDto]})
    findAllUsers(): Promise<User[]> {
        return this.userService.findTempoOneUsers();
    }
    
    
    @Get("/restauration-mot-de-passe")
        @ApiOperation({ summary: "Modifier le mot de passe d'un utilisateur"})
        @Roles(UserRole.Admin, UserRole.ResponsableExploitation, UserRole.User)
        @UserTypes(TypeUtilisateur.Prestataire, TypeUtilisateur.Livreur, TypeUtilisateur.Prestataire)
    passwordReset(@Query("mail") mail:string){
        return this.emailService.sendPasswordReset(mail);
    }
    
    /**
     * RECUPERER UN UTILISATEUR PAR SON ID
     * @param id ID de l'utilisateur
     * @returns Utilisateur
     */
    @Get("/:id")
    @UseGuards(SameUserGuard)
    @Roles(UserRole.Admin, UserRole.ResponsableExploitation, UserRole.User)
    @UserTypes(TypeUtilisateur.Prestataire, TypeUtilisateur.Livreur, TypeUtilisateur.Prestataire)
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
        @Roles(UserRole.Admin, UserRole.ResponsableExploitation, UserRole.User)
        @UserTypes(TypeUtilisateur.Prestataire, TypeUtilisateur.Livreur, TypeUtilisateur.Prestataire)
    getNotifications(@Param("id", ParseIntPipe) id: number): Promise<NotificationEntity[]> {
        return this.notifService.findByUser(id);
    }
}

