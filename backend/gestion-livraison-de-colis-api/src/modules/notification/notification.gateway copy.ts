// import { NotificationCreateDto } from './dto/notification-create-dto';
// import { BadRequestException, Injectable } from '@nestjs/common';
// import {
//   WebSocketGateway,
//   SubscribeMessage,
//   WebSocketServer,
//   OnGatewayConnection,
//   OnGatewayDisconnect,
//   MessageBody,
//   ConnectedSocket
// } from '@nestjs/websockets';
// import { Server, Socket } from 'socket.io';
// import { AlertDto } from 'src/common/dto/notification/notification-socket-dto';
// import { UserService } from '../user/user.service';
// import { LivreurService } from '../livreur/livreur.service';
// import { NotificationService } from './notification.service';
// import { TypeUtilisateur } from 'src/common/enum/type-utilisateur.enum';
// import { ConnectedUserDto } from 'src/common/dto/notification/notification-user-connected-dto';
// import { User } from '../user/user.entity';
// import { info } from 'console';
// import { ProblemeColisCreationDto } from 'src/common/dto/notification/probleme-colis-dto';

// @WebSocketGateway(
//     {
//         cors: 
//         {
//             origin: (origin, callback) => {
//             const allowedOrigin = `${process.env.CLIENT_DOMAINE_NAME}:${process.env.CLIENT_PORT}`;

//             console.log("Accepted origin: " + allowedOrigin);
//             console.log("Incoming origin: " + origin);
            
//             if(! origin){
//               callback(null, true);
//             } else if (origin === allowedOrigin) {
//               callback(null, true);
//             } else {
//               callback(new Error("Origin not allowed"), false);
//             }
//             }
//         },
//     }
// )
// @Injectable()
// export class NotificationGateway implements OnGatewayConnection, OnGatewayDisconnect {
//   constructor(
//     readonly userService: UserService,
//     readonly livreurService: LivreurService,
//     readonly notifService: NotificationService
//   ){}

//   @WebSocketServer()
//   server: Server;
//   // store connected users
//   private users: ConnectedUserDto[] = []; 

//   async handleConnection(client: Socket) {
//     console.log(`Client connected: ${client.id}`);
//     const userId = client.handshake.query.userId as string; // ID de l'utilisateur connecté

//     if(userId) {
//         try {
//             const matchedUser: User = await this.userService.findById(parseInt(userId));
//             const connectedUser = new ConnectedUserDto();

//             connectedUser.userID = matchedUser.id_utilisateur;  //ID de l'utilisateur
//             connectedUser.socketID = client.id; //ID Socket de l'utilisateur
//             connectedUser.typeUtilisateur = matchedUser.type_utilisateur.id_type_utilisateur; // Type de l'utilisateur (Tempo One, Prestataire, Livreur)
//             connectedUser.prestataireID = (matchedUser.prestataire === undefined || matchedUser.prestataire === null) 
//                 ? undefined : (await matchedUser.prestataire).id_prestataire;

//             this.users.push(connectedUser);
//         } catch (error) {
//             console.error(error);
//             throw new BadRequestException("ID utilisateur invalide");
//         }
            
//     }
//   }

//   handleDisconnect(client: Socket) {
//     console.log(`Client disconnected: ${client.id}`);
//     this.users = this.users.filter(user => user.socketID !== client.id);
//   }

//   @SubscribeMessage('send_alert')
//   async handleSendNotification(
//     @MessageBody() data: AlertDto,
//     @ConnectedSocket() client: Socket,
//   ) 
//   {
//     try {
//       this.saveNotification(client.id, data);
//       this.sendMessage(data);
//     } catch (error) {
//       console.error(error);
//     }
//   }


//   @SubscribeMessage('send_problem_colis_alert')
//   async handleProblemAlert(
//     @MessageBody() data: ProblemeColisCreationDto,
//     @ConnectedSocket() client: Socket,
//   ) {
//     try {
//       // Construire un message automatique pour l’alerte
//       const titre = `${data.problemeType} signalé pour le colis ID: ${data.idColis}`;
//       const message = `${data.description ?? 'Aucune description'}`;

//       // Construire un AlertDto classique pour réutiliser ton système
//       const alert: AlertDto = {
//         titre,
//         message,
//         receiverUserType: [TypeUtilisateur.TempoOne, TypeUtilisateur.Prestataire],
//         idReceiver: undefined
//       };

//       // Sauvegarde et envoi de l’alerte
//       await this.saveNotification(client.id, alert);
//       await this.sendMessage(alert);

//       console.log(`Problème colis signalé : ${message}`);
//     } catch (error) {
//       console.error("Erreur lors de l'envoi de l'alerte de problème colis :", error);
//     }
//   }


//   private async sendMessage(data: AlertDto){
//     const receiverSocketId = this.users.filter(user =>  data.receiverUserType.includes(user.typeUtilisateur));

//     if (receiverSocketId) {
//         try {    
//             const message = data.message;
//             const titre = data.titre;
//             receiverSocketId.forEach(receiver => {
//                 this.server.to(receiver.socketID).emit('receive_notification', {
//                       titre,
//                       message,
//                       timestamp: new Date(),
//                 });
//                 console.log(`Message: ${message} envoyé!`);
//             });

            
//         } catch (error) {
//             console.error(error);
//         }
//     } else {
//       console.warn(`User ${data.receiverUserType} may not online`);
//     }
//   }

//   private async saveNotification(clientSocketID: string, data: AlertDto){
//     const notifCreateDto = new NotificationCreateDto();
//     notifCreateDto.message = data.message;
//     notifCreateDto.titre = data.titre;
//     notifCreateDto.id_receveurs = [];

//     if (data.receiverUserType.includes(TypeUtilisateur.TempoOne)) {
//         const tempoOneUsers = await this.userService.findTempoOneUsers();
//         notifCreateDto.id_receveurs = notifCreateDto.id_receveurs.concat(tempoOneUsers.map(user => user.id_utilisateur));
//     } 

//     if (data.receiverUserType.includes(TypeUtilisateur.Prestataire)) {
//         const prestataireUsers = await this.userService.findPrestataireUsers(data.idReceiver);
//         notifCreateDto.id_receveurs = notifCreateDto.id_receveurs.concat(prestataireUsers.map(user => user.id_utilisateur));
//     } 

//     if(data.receiverUserType.includes(TypeUtilisateur.Livreur)) {
//         notifCreateDto.id_receveurs = notifCreateDto.id_receveurs.concat([data.idReceiver]);
//     } 
    
//     if(notifCreateDto.id_receveurs.length === 0) {
//         console.error("Type Utiilisateur inconnue");
//         throw new BadRequestException("Type Utiilisateur inconnue");
//     }
    
//     const senderID = this.getUserIdBySocketID(clientSocketID); 
//     const saved = await this.notifService.save(senderID, notifCreateDto);
//     info("Alert enregistré avec success!");

//     return saved;
//   }


//   private getUserIdBySocketID(socketID: string): number {
//     const matched = this.users.filter(u => u.socketID === socketID);

//     if(matched.length > 0) return matched[0].userID;

//     throw new Error(`L'utilisateur avec ID Socket:${socketID} est introuvable.`);
//   }
// }
