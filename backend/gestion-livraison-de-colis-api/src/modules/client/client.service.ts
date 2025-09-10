import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { ClientEntity } from './client.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { ClientCreateDto } from 'src/common/dto/client/client-create-dto';
import { Utils } from 'src/common/utils/utils';
import { ClientUpdateDto } from 'src/common/dto/client/client-update-dto';
import { PointLivraisonEntity } from '../point-livraison/point-livraison.entity';

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

    async batchSave(idPointLivraison: number, clientsDto: ClientCreateDto[]) {
        if (!clientsDto) {
            throw new BadRequestException("Données invalides!");
        }

        if(!idPointLivraison) throw new BadRequestException("ID Point de livraison invalide");

        return this.clientRep.manager.connection.transaction(async (manager) => {
            const clients: ClientEntity[] = clientsDto.map((data) => {
                const client = new ClientEntity();
                const pl = new PointLivraisonEntity();
                pl.id = idPointLivraison;

                client.nom_client = data.nom_client;
                client.prenom_client = data.prenom_client;
                client.numero_telephone = Utils.reformatToPhoneNumber(data.numero_telephone);
                client.adresse_mail = data.adresse_mail;
                client.civilite = data.civilite;
                client.point_livraison = pl;

                return client;
            });

            const prepared = manager.create(ClientEntity, clients);
            return await manager.save(ClientEntity, prepared);
        });
    }


    async save(data: ClientCreateDto){
        if(!data) throw new BadRequestException("Données invalides!");

        try {
            const client = new ClientEntity();
            const pl = new PointLivraisonEntity();
            pl.id = data.id_point_livraison;
    
            client.nom_client = data.nom_client;
            client.prenom_client = data.prenom_client;
            client.numero_telephone = Utils.reformatToPhoneNumber(data.numero_telephone);
            client.adresse_mail = data.adresse_mail;
            client.civilite = data.civilite;
            client.point_livraison = pl;
    
            const prepared = this.clientRep.create(client);
            return this.clientRep.save(prepared);
        } catch (error) {
            throw new BadRequestException(error);
        }
    }

    async update(id: number, data: ClientUpdateDto){
        if(!data && !id) throw new BadRequestException("Données invalides!");

        const client = await this.findById(id);
        client.nom_client = data.nom_client?? client.nom_client;
        client.prenom_client = data.prenom_client?? client.prenom_client;
        client.numero_telephone = Utils.reformatToPhoneNumber(data.numero_telephone?? client.numero_telephone);
        client.adresse_mail = data.adresse_mail?? client.adresse_mail;
        client.civilite = data.civilite;

        if(data.id_point_livraison) {
            const pl = new PointLivraisonEntity();
            pl.id = data.id_point_livraison;
            client.point_livraison = pl;
        }

        return this.clientRep.save(client);
    }
}
