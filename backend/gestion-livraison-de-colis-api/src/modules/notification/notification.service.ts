import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { NotificationEntity } from './notification.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { DeleteResult, In, Repository } from 'typeorm';
import { NotificationCreateDto } from 'src/common/dto/notification/notification-create-dto';
import { User } from '../user/user.entity';

@Injectable()
export class NotificationService {
    constructor(
        @InjectRepository(NotificationEntity)
        readonly notifRep: Repository<NotificationEntity>,
        @InjectRepository(User)
        readonly userRep: Repository<User>
    ){}

    async findAll(): Promise<NotificationEntity[]>{
        return this.notifRep.find({relations: ["envoyeur", "receveurs"]});
    }

    /**
     * LISTE DES NOTIFICATIONS RECUS PAR TYPE D'UTILISATEUR (Prestataire, Tempo One, livreur)
     * @param userID ID de l'utilisateur
     * @returns Liste des notifications
     */
    async findAllByUserType(userType: string): Promise<NotificationEntity[]>{
        if(!userType) throw new BadRequestException("Type Utilisateur est null");
        
        return this.notifRep.createQueryBuilder("notif")
            .innerJoinAndSelect("notif.envoyeur", "envoyeur")
            .innerJoin("notif.receveurs", "user")
            .innerJoin("user.type_utilisateur", "tu")
            .where("tu.id_type_utilisateur = :id", {id: userType})
            .getMany();
    }

    /**
     * LISTE DES NOTIFICATIONS RECUS PAR L'UTILISATEUR
     * @param userID ID de l'utilisateur
     * @returns Liste des notifications
     */
    async findByUser(userID: number): Promise<NotificationEntity[]>{
        return this.notifRep.createQueryBuilder("notif")
            .innerJoinAndSelect("notif.envoyeur", "envoyeur")
            .innerJoin("notif.receveurs", "user")
            .where("user.id_utilisateur = :id", {id: userID})
            .getMany();
    }

    async findById(id: number): Promise<NotificationEntity>{
        const matched = await this.notifRep.findOne(
            {
                where: {id: id},
                relations: ["envoyeur", "receveurs"]
            }
        );

        if(!matched) throw new NotFoundException("Notification inexistant");

        return matched;
    }

    async save(idEnvoyeur: number, dto: NotificationCreateDto): Promise<NotificationEntity>{
        if(!dto) throw new BadRequestException("Donnée de création de notification est null");
        if(!idEnvoyeur) throw new BadRequestException("ID Utilisateur est null");

        const receveurs: User[] = await this.userRep.findBy({id_utilisateur: In(dto.id_receveurs)});
        const envoyeur: User|null = await this.userRep.findOneBy({id_utilisateur: idEnvoyeur});

        if(!receveurs || receveurs.length === 0) throw new NotFoundException("Utilisateurs introuvables!");
        if(!envoyeur) throw new NotFoundException("Utilisateur envoyeur introuvable!");

        const notif = new NotificationEntity();

        notif.titre = dto.titre;
        notif.message = dto.message;
        notif.receveurs = receveurs;
        notif.envoyeur = envoyeur;

        const prepared = this.notifRep.create(notif);
        return this.notifRep.save(prepared);
    }

    async delete(id:number): Promise<DeleteResult>{
        await this.findById(id);
        return await this.notifRep.delete(id);
    }
}
