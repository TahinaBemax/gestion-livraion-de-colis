import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { NotificationEntity } from './notification.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { DeleteResult, In, Repository } from 'typeorm';
import { NotificationCreateDto } from 'src/common/dto/notification/notification-create-dto';
import { User } from '../user/user.entity';
import { TypeUtilisateur } from 'src/common/enum/type-utilisateur.enum';

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
     * LISTE DES NOTIFICATIONS pour Tempo One
     * @param userID ID de l'utilisateur
     * @returns Liste des notifications
     */
    async findTempoOneNotifications(): Promise<NotificationEntity[]>{
        const userType = TypeUtilisateur.TempoOne;

        return this.notifRep.createQueryBuilder("notif")
            .innerJoinAndSelect("notif.envoyeur", "envoyeur")
            .innerJoin("notif.receveurs", "user")
            .innerJoin("user.type_utilisateur", "tu")
            .where("tu.id_type_utilisateur = :id", {id: userType})
            .orderBy("notif.dateheure_notification", 'DESC')
            .getMany();
    }

    /**
     * LISTE DES NOTIFICATIONS pour Tempo One
     * @param userID ID de l'utilisateur
     * @returns Liste des notifications
     */
    async findLivreurNotifications(idLivreur: number): Promise<NotificationEntity[]>{
        const userType = TypeUtilisateur.Livreur;

        return this.notifRep.createQueryBuilder("notif")
            .innerJoinAndSelect("notif.envoyeur", "envoyeur")
            .innerJoin("notif.receveurs", "user")
            .innerJoin("user.type_utilisateur", "tu")
            .innerJoin("user.livreur", "livreur")
            .where("tu.id_type_utilisateur = :id", {id: userType})
            .andWhere("livreur.id_livreur = :idLivreur ", {idLivreur: idLivreur})
            .orderBy("notif.dateheure_notification", 'DESC')
            .getMany();
    }

    /**
     * LISTE DES NOTIFICATIONS D'UN PRESTATAIRE
     * @param userID ID Prestataire
     * @returns Liste des notifications
     */
    async findPrestataireNotications(idPrestataire: number): Promise<NotificationEntity[]>{
        if(!idPrestataire) throw new BadRequestException("ID Prestataire est null");
        
        return this.notifRep.createQueryBuilder("notif")
            .innerJoinAndSelect("notif.envoyeur", "envoyeur")
            .innerJoinAndSelect("notif.receveurs", "user")
            .innerJoin("user.prestataire", "prestataire")
            .where("prestataire.id_prestataire = :id", {id: idPrestataire})
            .orderBy("notif.dateheure_notification", 'DESC')
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
            .orderBy("notif.dateheure_notification", 'DESC')
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
        notif.dateheure_notification = new Date().toUTCString();

        const prepared = this.notifRep.create(notif);
        return this.notifRep.save(prepared);
    }

    async delete(id:number): Promise<DeleteResult>{
        await this.findById(id);
        return await this.notifRep.delete(id);
    }
}
