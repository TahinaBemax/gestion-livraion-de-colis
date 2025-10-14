import { StatusColis } from './../../../common/enum/status-colis.enum';
import { ColisService } from './../../colis/colis.service';
import { UserService } from './../../user/user.service';
import { NotificationCreateDto } from './../dto/notification-create-dto';
import { NotificationService } from './../notification.service';
import { BadRequestException, Injectable } from '@nestjs/common';
import { ConnectedUserDto } from './../../../common/dto/notification/notification-user-connected-dto';
import { Server } from 'socket.io';
import { AlertProblemeColisDto } from './../dto/alert-probleme-colis-dto';
import { User } from '../../user/user.entity';
import { DataSource } from 'typeorm';
import { ProblemeColisEntity } from '../../colis/probleme-colis.entity';
import { ColisEntity } from '../../colis/colis.entity';

@Injectable()
export class ProblemColisHandler {
    constructor(
        private readonly notificationService: NotificationService,
        private readonly userService: UserService,
        private readonly colisService: ColisService,
        private readonly datasource: DataSource
    ) {}

    async handle(data: AlertProblemeColisDto, server: Server, users: ConnectedUserDto[]) {
        console.log("Handling problem colis event...");
        const prestataireUsers:User[] = await this.userService.findPrestataireUsers(data.idPrestataire);

        if(prestataireUsers.length === 0) throw new BadRequestException("Aucun utilisateur trouvé pour ce prestataire");
        const colis = await this.colisService.findById(data.idColis);
        colis.statut_colis = StatusColis.ANOMALIE;

        // Envoyer la notification en temps réel via WebSocket
        const notification: NotificationCreateDto = {
            envoyeur: data.idLivreur,
            receveurs: prestataireUsers.map(user => user.id_utilisateur),
            titre: data.titreProbleme,
            message: data.description,
            dateheure_notification: new Date().toISOString(),
        }
        const problemeColis: ProblemeColisEntity = {
            id: -1,
            titre: data.titreProbleme,
            description: data.description,
            colis
        }
        

        const saved = await this.notificationService.save(data.idLivreur, notification);
        this.datasource.manager.save(ColisEntity, colis);
        this.datasource.manager.save(ProblemeColisEntity, problemeColis);

        users.forEach(u => {
            prestataireUsers.forEach(pUser => {
                if(pUser.id_utilisateur === u.userID){
                    server.to(u.socketID).emit('receive_notification', {saved});
                }
            });
        });
    }
    
}