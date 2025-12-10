import { Body, Controller, Get, Param, ParseIntPipe, Post, Put } from '@nestjs/common';
import { ClientService } from './client.service';
import { ClientCreateDto } from 'src/common/dto/client/client-create-dto';
import { ClientEntity } from './client.entity';
import { Roles, UserTypes } from 'src/common/decorators/roles.decorator';
import { UserRole } from 'src/common/enum/user-role.enum';
import { TypeUtilisateur } from 'src/common/enum/type-utilisateur.enum';
import { ApiBody, ApiTags } from '@nestjs/swagger';
import { ClientUpdateDto } from 'src/common/dto/client/client-update-dto';

@Controller('clients')
@ApiTags("Clients")
export class ClientController {
    constructor(
        private readonly clientService: ClientService
    ){}

    @Put("/:id")
    @Roles(UserRole.Admin)
    @UserTypes(TypeUtilisateur.TempoOne)
    @ApiBody({type: ClientUpdateDto})
    async update(@Param("id", ParseIntPipe) id: number, @Body() data: ClientUpdateDto): Promise<ClientEntity>{
        return this.clientService.update(id, data);
    }

    @Post("")
    @Roles(UserRole.Admin)
    @UserTypes(TypeUtilisateur.TempoOne)
    @ApiBody({type: ClientUpdateDto})
    async save(@Body() data: ClientCreateDto): Promise<ClientEntity>{
        return this.clientService.save(data);
    }

    @Get()
    @Roles(UserRole.Admin, UserRole.User)
    @UserTypes(TypeUtilisateur.TempoOne)
    async getAll(): Promise<ClientEntity[]>{
        return this.clientService.findAll();
    }

    @Get("/:id")
    @Roles(UserRole.Admin, UserRole.User)
    @UserTypes(TypeUtilisateur.TempoOne)
    async getById(@Param("id", ParseIntPipe) id: number): Promise<ClientEntity>{
        return this.clientService.findById(id);
    }
}
