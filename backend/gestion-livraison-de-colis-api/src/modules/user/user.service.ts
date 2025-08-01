import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './user.entity';
import { CreateUserDto } from 'src/common/dto/create-user-dto';
import { UserMapper } from './utils/user.mapper';

@Injectable()
export class UserService {
    constructor(
        @InjectRepository(User)
        private readonly userRepo: Repository<User>, 
        private readonly userMapper: UserMapper
    ){}

    async create(create_user: CreateUserDto): Promise<User>{
        const user: User = await this.userMapper.fromDto(create_user);
        const temp_user = this.userRepo.create(user);
        return this.userRepo.save(temp_user);
    }

    findAll():Promise<User[]>{
        return this.userRepo.findBy({est_active: true});
    }

    async findById(id: number): Promise<User> {
        const user = await this.userRepo.findOneBy({id_utilisateur: id});

        if (!user) {
            throw new NotFoundException(`User id: ${id} is not found`)
        }

        return user;
    }

    async delete(id: number): Promise<boolean> {
        const user = await this.findById(id);
        user.est_active = false;

        return this.userRepo.save(user) !== null;
    }

    async update(user: User): Promise<User>{
        if (!user.id_utilisateur) throw new BadRequestException("L'id de utilisateur est null");

        const temp_user = await this.findById(user.id_utilisateur);

        if(!temp_user) throw new NotFoundException(`L'utilisateur id:${user.id_utilisateur} est introuvable`);

        return this.userRepo.save(user);
    }

    async activateUser(id: number):Promise<User> {
        if (!id) throw new BadRequestException("L'id de utilisateur est null");

        const temp_user = await this.findById(id);
        if(!temp_user) throw new NotFoundException(`L'utilisateur id:${id} est introuvable`);
        temp_user.est_active = true;

        return this.userRepo.save(temp_user);
    }
}
