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

@WebSocketGateway(
    {
        cors: 
        {
            origin: (origin, callback) => {
            const allowedOrigin = `${process.env.CLIENT_DOMAINE_NAME}:${process.env.CLIENT_PORT}`;

            console.log("Accepted origin: " + allowedOrigin);
            console.log("Incoming origin: " + origin);
            
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
  ){}

  @WebSocketServer()
  server: Server;
  // store connected users
  private users: ConnectedUserDto[] = []; 

  async handleConnection(client: Socket) {
    console.log(`Client connected: ${client.id}`);
    const userId = client.handshake.query.userId as string; // ID de l'utilisateur connecté

    if(userId) {
        try {
            const matchedUser: User = await this.userService.findById(parseInt(userId));
            const connectedUser = new ConnectedUserDto();

            connectedUser.userID = matchedUser.id_utilisateur;  //ID de l'utilisateur
            connectedUser.socketID = client.id; //ID Socket de l'utilisateur
            connectedUser.typeUtilisateur = matchedUser.type_utilisateur.id_type_utilisateur; // Type de l'utilisateur (Tempo One, Prestataire, Livreur)
            connectedUser.prestataireID = (matchedUser.prestataire === undefined || matchedUser.prestataire === null) 
                ? undefined : (await matchedUser.prestataire).id_prestataire;

            this.users.push(connectedUser);
        } catch (error) {
            console.error(error);
            throw new BadRequestException("ID utilisateur invalide");
        }
            
    }
  }

  handleDisconnect(client: Socket) {
    console.log(`Client disconnected: ${client.id}`);
    this.users = this.users.filter(user => user.socketID !== client.id);
  }


  @SubscribeMessage('send_problem_colis_alert')
  async handleProblemColisAlert(@MessageBody() data: AlertProblemeColisDto, @ConnectedSocket() client: Socket) {
    try {
        this.problemeColisHandler.handle(data, this.server, this.users);
    } catch (error) {
      console.error("Erreur lors de l'envoi de l'alerte de problème colis :", error);
    }
  }

  @SubscribeMessage('send_problem_livraison_alert')
  async handleProblemLivraisonAlert(@MessageBody() data: AlertProblemeLivraisonDto, @ConnectedSocket() client: Socket) {
    try {
        this.problemeLivraisonHandler.handle(data, this.server, this.users);
    } catch (error) {
      console.error("Erreur lors de l'envoi de l'alerte de problème colis :", error);
    }
  }

  @SubscribeMessage('send_alert_from_prestataire_to_tempoOne')
  async handleAlertFromPrestataireToTempoOne(@MessageBody() data: AlertProblemeColisDto, @ConnectedSocket() client: Socket) {
    try {
        this.problemeColisHandler.handle(data, this.server, this.users);
    } catch (error) {
      console.error("Erreur lors de l'envoi de l'alerte de problème colis :", error);
    }
  }

  @SubscribeMessage('send_alert_from_tempoOne_to_prestataire')
  async handleAlertFromTempoOneToPrestataire(@MessageBody() data: AlertProblemeLivraisonDto, @ConnectedSocket() client: Socket) {
    try {
        this.problemeLivraisonHandler.handle(data, this.server, this.users);
    } catch (error) {
      console.error("Erreur lors de l'envoi de l'alerte de problème colis :", error);
    }
  }

}
