import { AlertProblemeLivraisonDto } from '../dto/alert-probleme-livraison-dto';
import { UserService } from '../../user/user.service';
import { NotificationCreateDto } from '../dto/notification-create-dto';
import { NotificationService } from '../notification.service';
import { BadRequestException, Injectable } from '@nestjs/common';
import { ConnectedUserDto } from '../../../common/dto/notification/notification-user-connected-dto';
import { Server } from 'socket.io';
import { User } from '../../user/user.entity';
import { DataSource } from 'typeorm';
import { ProblemeLivraisonEntity } from '../../livraisons/probleme-livraison.entity';
import { LivraisonsService } from '../../livraisons/livraisons.service';
import { OrdreLivraisonEntity } from '../../ordre-livraison/ordre-livraison.entity';
import { NotificationGateway } from '../notification.gateway';

@Injectable()
export class ProblemLivraisonHandler {
    constructor(
        private readonly notificationService: NotificationService,
        private readonly userService: UserService,
        private readonly livraisonService: LivraisonsService,
        private readonly datasource: DataSource,
    ) {}

    async handle(data: AlertProblemeLivraisonDto, server: Server, users: ConnectedUserDto[]) {
        const estLeLiveur = this.livraisonService.estLivreurDuLivraison(data.idLivreur, data.idLivraison);

        if(!estLeLiveur) {
            throw new BadRequestException("Le livreur n'est pas associé à cette livraison");
        }

        const prestataireUsers:User[] = await this.userService.findPrestataireUsers(data.idPrestataire);
        const tempoOneUsers:User[] = await this.userService.findTempoOneUsers();
        if(prestataireUsers.length === 0) throw new BadRequestException("Aucun utilisateur trouvé pour ce prestataire");
        
        const livraison = await this.livraisonService.findById(data.idLivraison);
        livraison.ordre_livraison.estimation_retard = data.estimationRestard;

        // Envoyer la notification en temps réel via WebSocket
        const notification: NotificationCreateDto = {
            envoyeur: data.idLivreur,
            receveurs: prestataireUsers.map(user => user.id_utilisateur),
            titre: data.titreProbleme,
            message: data.description,
            dateheure_notification: new Date().toISOString(),
        }

        const problemeColis: ProblemeLivraisonEntity = {
            id: -1,
            titre: data.titreProbleme,
            description: data.description,
            livraison
        }
        

        const saved = await this.notificationService.save(data.idLivreur, notification);
        this.datasource.manager.save(OrdreLivraisonEntity, livraison.ordre_livraison);
        this.datasource.manager.save(ProblemeLivraisonEntity, problemeColis);

        const allUsers = prestataireUsers.concat(tempoOneUsers);
        NotificationGateway.emitNotificationToUser(server, saved, users, allUsers);
    }
    
}