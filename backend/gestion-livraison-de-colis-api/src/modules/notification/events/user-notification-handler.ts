import { Injectable } from "@nestjs/common";
import { AlertDto } from "src/common/dto/notification/notification-socket-dto";
import { ConnectedUserDto } from "src/common/dto/notification/notification-user-connected-dto";
import { NotificationService } from "../notification.service";
import { Server, Socket } from 'socket.io';

@Injectable()
export class UserNotificationHandler {
  constructor(private readonly notifService: NotificationService) {}

  async handle(clientId: string, data: AlertDto, users: Map<string, ConnectedUserDto>, server: Server) {
    const sender = Array.from(users.values()).find(u => u.socketID === clientId);
    if (!sender) throw new Error('Utilisateur non connecté');

    const notif = await this.notifService.save(sender.userID, {
      titre: data.titre,
      message: data.message,
      id_receveurs: [data.idReceiver]
    });

    // envoyer en temps réel
    for (const [, user] of users) {
      if (data.receiverUserType.includes(user.typeUtilisateur)) {
        server.to(user.socketID).emit('receive_notification', {
          type: 'USER_NOTIFICATION',
          ...notif,
          timestamp: new Date()
        });
      }
    }
  }
}
