import { BadRequestException, Injectable } from '@nestjs/common';
import {
  WebSocketGateway,
  SubscribeMessage,
  WebSocketServer,
  OnGatewayConnection,
  OnGatewayDisconnect,
  MessageBody,
  ConnectedSocket
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { ConnectedUserDto } from 'src/common/dto/notification/notification-user-connected-dto';
import { User } from '../user/user.entity';
import { AlertProblemeColisDto } from './dto/alert-probleme-colis-dto';
import { AlertProblemeLivraisonDto } from './dto/alert-probleme-livraison-dto';
import { ProblemColisHandler } from './events/problem-colis-handler.service';
import { ProblemLivraisonHandler } from './events/problem-livraison-handler.service';
import { UserNotificationHandler } from './events/user-notification-handler.service';
import { UserService } from '../user/user.service';
import { AlertFromPrestataireToTempoOneDto } from './dto/alert-from-prestataire-to-tempoOne-dto';
import { AlertFromTempoOneToPrestataireDto } from './dto/alert-from-tempoOne-to-prestataire-dto';
import { NotificationEntity } from './notification.entity';

@WebSocketGateway(
    {
        cors: 
        {
            origin: (origin, callback) => {
            const allowedOrigin = `${process.env.CLIENT_DOMAINE_NAME}:${process.env.SOCKET_PORT}`;
            
            if(! origin){
              callback(null, true);
            } else if (origin === allowedOrigin) {
              callback(null, true);
            } else {
              callback(new Error("Origin not allowed"), false);
            }
            }
        },
    }
)
@Injectable()
export class NotificationGateway implements OnGatewayConnection, OnGatewayDisconnect {
  constructor(
    private readonly problemeColisHandler: ProblemColisHandler,
    private readonly problemeLivraisonHandler: ProblemLivraisonHandler,
    private readonly userNotificationHandler: UserNotificationHandler,
    private readonly userService: UserService,

  ){}

  @WebSocketServer()
  private server: Server;
  private users: ConnectedUserDto[] = []; // store connected users

  async handleConnection(client: Socket) {
    const userId = client.handshake.query.userId as string; // ID de l'utilisateur connecté
    console.log(`ID USER: ${userId} rattaché au socket ID: ${client.id}`);

    if(userId) {
        try {
            const matchedUser: User = await this.userService.findById(parseInt(userId));
            const connectedUser = new ConnectedUserDto();

            connectedUser.userID = matchedUser.id_utilisateur;  //ID de l'utilisateur
            connectedUser.socketID = client.id; //ID Socket de l'utilisateur
            this.users.push(connectedUser);
        } catch (error) {
            console.error(error);
            throw new BadRequestException("ID utilisateur invalide");
        }
            
    }
  }

  handleDisconnect(client: Socket) {
    const userId = client.handshake.query.userId as string; // ID de l'utilisateur connecté
    console.log(`ID USER: ${userId} rattaché au socket ID: ${client.id} s'est deconnecté`);
    this.users = this.users.filter(user => user.socketID !== client.id);
  }


  @SubscribeMessage('send_problem_colis_alert')
  async handleProblemColisAlert(@MessageBody() data: AlertProblemeColisDto, @ConnectedSocket() client: Socket) {
    try {
        this.problemeColisHandler.handle(data, this.server, this.users);
    } catch (error) {
      console.error("Erreur lors de l'envoi de l'alerte de problème colis :", error);
      this.emitError(data.idLivreur, "Erreur lors de l'envoi de l'alerte de problème colis: " + error.message);
    }
  }

  @SubscribeMessage('send_problem_livraison_alert')
  async handleProblemLivraisonAlert(@MessageBody() data: AlertProblemeLivraisonDto, @ConnectedSocket() client: Socket) {
    try {
        this.problemeLivraisonHandler.handle(data, this.server, this.users);
    } catch (error) {
      console.error("Erreur lors de l'envoi de l'alerte de problème livraison :", error);
      this.emitError(data.idLivreur, "Erreur lors de l'envoi de l'alerte de problème livraison.");
    }
  }

  @SubscribeMessage('send_alert_from_prestataire_to_tempoOne')
  async handleAlertFromPrestataireToTempoOne(@MessageBody() data: AlertFromPrestataireToTempoOneDto) {
    try {
        this.userNotificationHandler.handleAlertFromPrestataireToTempoOne(data, this.server, this.users);
    } catch (error) {
      console.error("Erreur lors de l'envoi de l'alerte vers Tempo One :", error);
      this.emitError(data.idUser, "Erreur lors de l'envoi de l'alerte");
    }
  }

  @SubscribeMessage('send_alert_from_tempoOne_to_prestataire')
  async handleAlertFromTempoOneToPrestataire(@MessageBody() data: AlertFromTempoOneToPrestataireDto) {
    try {
        this.userNotificationHandler.handleAlertFromTempoOneToPrestataire(data, this.server, this.users);
    } catch (error) {
      console.error("Erreur lors de l'envoi de l'alerte vers le prestataire :", error);
      this.emitError(data.idUtilisateur, "Erreur lors de l'envoi de l'alerte");
    }
  }


  private async emitError(idEnvoyeur: number, message: string) {
    this.users.forEach(u => {
      if(idEnvoyeur === u.userID){
          this.server
            .to(u.socketID)
            .emit('receive_notification', {error: message});
      }
    });   
  }

  static emitNotificationToUser(server: Server, notification: NotificationEntity,connectedUsers: ConnectedUserDto[], users: User[]) {
    connectedUsers.forEach(u => {
        users.forEach(pUser => {
            if(pUser.id_utilisateur === u.userID){
                const s: any = notification;
                const payload = {
                    id: s.id,
                    titre: s.titre,
                    message: s.message,
                    envoyeur: {
                        id_utilisateur: s.envoyeur?.id_utilisateur,
                        nom: s.envoyeur?.nom,
                        prenom: s.envoyeur?.prenom,
                    }
                };
                server.to(u.socketID).emit('receive_notification', payload);
            }
        });
    });
  }
}
