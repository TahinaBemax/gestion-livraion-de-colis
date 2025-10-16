import { Injectable } from "@nestjs/common";
import { ConnectedUserDto } from "src/common/dto/notification/notification-user-connected-dto";
import { NotificationService } from "../notification.service";
import { Server } from 'socket.io';
import { User } from "src/modules/user/user.entity";
import { NotificationCreateDto } from "../dto/notification-create-dto";
import { AlertFromPrestataireToTempoOneDto } from "../dto/alert-from-prestataire-to-tempoOne-dto";
import { UserService } from "src/modules/user/user.service";
import { AlertFromTempoOneToPrestataireDto } from "../dto/alert-from-tempoOne-to-prestataire-dto";
import { NotificationGateway } from "../notification.gateway";

@Injectable()
export class UserNotificationHandler {
  constructor(
        private readonly notificationService: NotificationService,
        private readonly userService: UserService
  ) {}

    async handleAlertFromPrestataireToTempoOne(data: AlertFromPrestataireToTempoOneDto, server: Server, users: ConnectedUserDto[]) {
        console.log("Handling notification from prestataire to Tempo One event...");
        const destinataireUser:User[] = await this.userService.findTempoOneUsers();

        // Envoyer la notification en temps réel via WebSocket
        const notification: NotificationCreateDto = {
            envoyeur: data.idPrestataire,
            receveurs: destinataireUser.map(user => user.id_utilisateur),
            titre: data.titreProbleme,
            message: data.description,
            dateheure_notification: new Date().toISOString(),
        }

        const saved = await this.notificationService.save(data.idUser, notification);
        NotificationGateway.emitNotificationToUser(server, saved, users, destinataireUser);
    }
    async handleAlertFromTempoOneToPrestataire(data: AlertFromTempoOneToPrestataireDto, server: Server, users: ConnectedUserDto[]) {
        console.log("Handling notification from Tempo One to prestataire event...");
        const destinataireUser:User[] = await this.userService.findPrestataireUsers(data.idPrestataire);

        // Envoyer la notification en temps réel via WebSocket
        const notification: NotificationCreateDto = {
            envoyeur: data.idUtilisateur,
            receveurs: destinataireUser.map(user => user.id_utilisateur),
            titre: data.titreProbleme,
            message: data.description,
            dateheure_notification: new Date().toISOString(),
        }

        const saved = await this.notificationService.save(data.idUtilisateur, notification);
        NotificationGateway.emitNotificationToUser(server, saved, users, destinataireUser);
    }
}
