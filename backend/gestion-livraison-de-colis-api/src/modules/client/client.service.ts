import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { ClientEntity } from './client.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { ClientCreateDto } from 'src/common/dto/client/client-create-dto';
import { Utils } from 'src/common/utils/utils';
import { ClientUpdateDto } from 'src/common/dto/client/client-update-dto';

@Injectable()
export class ClientService {
    constructor(
        @InjectRepository(ClientEntity)
        private readonly clientRep: Repository<ClientEntity>
    ){}

    async findAll(): Promise<ClientEntity[]> {
        return this.clientRep.find();
    }

    async findById(id: number): Promise<ClientEntity> {
        const matched = await this.clientRep.findOneBy({id: id});

        if(!matched) throw new NotFoundException(`Client inexistant!`);

        return matched;
    }

    async save(data: ClientCreateDto){
        if(!data) throw new BadRequestException("Données invalides!");

        const client = new ClientEntity();
        client.nom_client = data.nom_client;
        client.prenom_client = data.prenom_client;
        client.numero_telephone = Utils.reformatToPhoneNumber(data.numero_telephone);
        client.adresse_mail = data.adresse_mail;
        client.civilite = data.civilite;

        const prepared = this.clientRep.create(client);
        return this.clientRep.save(prepared);
    }

    async update(id: number, data: ClientUpdateDto){
        if(!data && !id) throw new BadRequestException("Données invalides!");

        const client = await this.findById(id);
        client.nom_client = data.nom_client?? client.nom_client;
        client.prenom_client = data.prenom_client?? client.prenom_client;
        client.numero_telephone = Utils.reformatToPhoneNumber(data.numero_telephone?? client.numero_telephone);
        client.adresse_mail = data.adresse_mail?? client.adresse_mail;
        client.civilite = data.civilite;

        return this.clientRep.save(client);
    }
}
