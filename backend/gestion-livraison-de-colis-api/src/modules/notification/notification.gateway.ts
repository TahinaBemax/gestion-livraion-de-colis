import { NotificationCreateDto } from './../../common/dto/notification/notification-create-dto';
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
import { AlertDto } from 'src/common/dto/notification/notification-socket-dto';
import { UserService } from '../user/user.service';
import { LivreurService } from '../livreur/livreur.service';
import { NotificationService } from './notification.service';
import { TypeUtilisateur } from 'src/common/enum/type-utilisateur.enum';
import { ConnectedUserDto } from 'src/common/dto/notification/notification-user-connected-dto';
import { error } from 'console';
import { User } from '../user/user.entity';

@WebSocketGateway(
    {
        cors: "*",
        // {
        //     origin: (origin, callback) => {
        //     const allowedOrigin = process.env.CLIENT_ORIGIN;
        //     console.log(allowedOrigin);
            
        //     if (origin === allowedOrigin) {
        //         callback(null, true);
        //     } else {
        //         callback(new Error("Origin not allowed"), false);
        //     }
        //     }
        // },
    }
)
@Injectable()
export class NotificationGateway implements OnGatewayConnection, OnGatewayDisconnect {
    constructor(
        readonly userService: UserService,
        readonly livreurService: LivreurService,
        readonly notifService: NotificationService
    ){}

  @WebSocketServer()
  server: Server;

  // store connected users
  private users: ConnectedUserDto[] = []; 
  // key: typeUtilisateur, value: <userId, socketId>

  async handleConnection(client: Socket) {
    console.log(`Client connected: ${client.id}`);
    // You should authenticate the user here (e.g., via JWT)
    const userId = client.handshake.query.userId as string;

    if(userId) {
        try {
            const matchedUser: User = await this.userService.findById(parseInt(userId));
            const connectedUser = new ConnectedUserDto();

            connectedUser.userID = matchedUser.id_utilisateur;
            connectedUser.socketID = client.id;
            connectedUser.typeUtilisateur = matchedUser.type_utilisateur.id_type_utilisateur;
            connectedUser.prestataireID = (matchedUser.prestataire === undefined || matchedUser.prestataire === null) 
                ? undefined : matchedUser.prestataire.id_prestataire;

            this.users.push(connectedUser);
        } catch (error) {
            console.error(error);
            throw new BadRequestException("ID utilisateur invalide");
        }
            
    }
  }

  handleDisconnect(client: Socket) {
    console.log(`Client disconnected: ${client.id}`);
    this.users = this.users.filter(user => user.socketID === client.id);
  }

  @SubscribeMessage('send_alert')
  async handleSendNotification(
    @MessageBody() data: AlertDto,
    @ConnectedSocket() client: Socket,
  ) 
  {
    this.saveNotification(data);
    this.sendMessage(data);
  }

  private async sendMessage(data: AlertDto){
    const receiverSocketId = this.users.filter(user => user.typeUtilisateur === data.receiverUserType);

    if (receiverSocketId) {
        try {    
            const message = data.message;
            const titre = data.titre;
            receiverSocketId.forEach(receiver => {
                this.server.to(receiver.socketID).emit('receive_notification', {
                      titre,
                      message,
                      timestamp: new Date(),
                });
                console.log(`Message: ${message} envoyé!`);
            });

            
        } catch (error) {
            console.error(error);
        }
    } else {
      console.log(`User ${data.receiverUserType} may not online`);
    }
  }

  private async saveNotification(data: AlertDto){
    const notifCreateDto = new NotificationCreateDto();
    notifCreateDto.message = data.message;
    notifCreateDto.titre = data.titre;
    if (data.receiverUserType === TypeUtilisateur.TempoOne) {
        const tempoOneUsers = await this.userService.findTempoOneUsers();
        notifCreateDto.id_receveurs = tempoOneUsers.map(user => user.id_utilisateur);
    } else if (data.receiverUserType === TypeUtilisateur.Prestataire) {
        const prestataireUsers = await this.userService.findPrestataireUsers(data.idReceiver);
        notifCreateDto.id_receveurs = prestataireUsers.map(user => user.id_utilisateur);
    } else if(data.receiverUserType === TypeUtilisateur.Livreur) {
        notifCreateDto.id_receveurs = [data.idReceiver];
    } else {
        console.error("Type Utiilisateur inconnue");
        throw new BadRequestException("Type Utiilisateur inconnue");
    }
    
    const saved = true//await this.notifService.save(parseInt(from), notifCreateDto);
  }
}
