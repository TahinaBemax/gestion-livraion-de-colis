import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './user.entity';

@Injectable()
export class UserService {
    constructor(
        @InjectRepository(User)
        private userRepo: Repository<User>
    ){}

    async create(user: User): Promise<User>{
        const temp_user = this.userRepo.create(user);
        return this.userRepo.save(temp_user);
    }

    findAll():Promise<User[]>{
        return this.userRepo.find();
    }

    async findById(id: number): Promise<User> {
        const user = await this.userRepo.findOneBy({id_utilisateur});

        if (!user) {
            throw new NotFoundException(`User id: ${id} is not found`)
        }

        return user;
    }
}
