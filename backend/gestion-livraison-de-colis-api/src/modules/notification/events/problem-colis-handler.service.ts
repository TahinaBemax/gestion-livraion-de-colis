import { StatusColis } from '../../../common/enum/status-colis.enum';
import { ColisService } from '../../colis/colis.service';
import { UserService } from '../../user/user.service';
import { NotificationCreateDto } from '../dto/notification-create-dto';
import { NotificationService } from '../notification.service';
import { BadRequestException, Injectable } from '@nestjs/common';
import { ConnectedUserDto } from '../../../common/dto/notification/notification-user-connected-dto';
import { Server } from 'socket.io';
import { AlertProblemeColisDto } from '../dto/alert-probleme-colis-dto';
import { User } from '../../user/user.entity';
import { DataSource } from 'typeorm';
import { ProblemeColisEntity } from '../../colis/probleme-colis.entity';
import { ColisEntity } from '../../colis/colis.entity';
import { NotificationGateway } from '../notification.gateway';

@Injectable()
export class ProblemColisHandler {
    constructor(
        private readonly notificationService: NotificationService,
        private readonly userService: UserService,
        private readonly colisService: ColisService,
        private readonly datasource: DataSource
    ) {}

    async handle(data: AlertProblemeColisDto, server: Server, users: ConnectedUserDto[]) {
        try {
            const estRattache = await this.colisService.estRattacheLivreur(data.idLivreur, data.idColis);
            if(!estRattache) throw new BadRequestException("Le livreur n'est pas rattaché à ce colis");

            const prestataireUsers: User[] = await this.userService.findPrestataireUsers(data.idPrestataire);
            const tempoOneUsers: User[] = await this.userService.findTempoOneUsers();
            if(prestataireUsers.length === 0) throw new BadRequestException("Aucun utilisateur trouvé pour ce prestataire");

            const colis = await this.colisService.findById(data.idColis);
            colis.statut_colis = StatusColis.ANOMALIE;

            // Préparer les objets à persister
            const notification: NotificationCreateDto = {
                envoyeur: data.idLivreur,
                receveurs: prestataireUsers.map(user => user.id_utilisateur),
                titre: data.titreProbleme,
                message: data.description,
                dateheure_notification: new Date().toISOString(),
            };

            const problemeColis: ProblemeColisEntity = {
                id: -1,
                titre: data.titreProbleme,
                description: data.description,
                colis: colis
            };

            // Transaction : sauvegarder notification, colis et problème ensemble
            const saved = await this.datasource.transaction(async (manager) => {
                // Si notificationService.save n'accepte pas d'EntityManager, on l'appelle normalement.
                // On suppose ici qu'il gère sa propre persistance et peut être appelé dans la transaction callback.
                const notifSaved = await this.notificationService.save(data.idLivreur, notification);

                await manager.save(ColisEntity, colis);
                await manager.save(ProblemeColisEntity, problemeColis);

                return notifSaved;
            });

            const allUsers = prestataireUsers.concat(tempoOneUsers);
            NotificationGateway.emitNotificationToUser(server, saved, users, allUsers);
        } catch (error) {
            throw error;
        }
    }
    
    
}