export class NotificationCreateDto {
    titre:string;
    message: string;
    dateheure_notification: string;
    envoyeur: number;
    receveurs: number[];
}