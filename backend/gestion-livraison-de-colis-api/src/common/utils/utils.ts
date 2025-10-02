import { BadRequestException, InternalServerErrorException } from "@nestjs/common";
import { isValid, parse } from "date-fns";
import * as bcrypt from "bcrypt";
import * as QRCode from 'qrcode';

export class Utils {
    static currencyFormat(nombre: number){
        return Number(nombre).toLocaleString("en-US", {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
        });
    }

    static getDayInWord(date: Date): string{
        const local: string = 'fr-FR';
        const jourSemaine = date.toLocaleDateString(local, {weekday: 'long'});

        return jourSemaine.toLowerCase();
    }
    static isPresentOrFuture(startDate: string): boolean{
        try {
            const isValidDate = Utils.parseToFRDate(startDate);
            console.log(`START DATE: ${isValidDate}`);
            const now = new Date();
            if (!isValidDate) {
                throw new BadRequestException('Format de date invalide');
            }

            if(now > isValidDate){
                throw new BadRequestException("La date de début doit être la date actuelle ou la date de future");
            }

            return true;
        } catch (error) {
            throw new InternalServerErrorException('Erreur lors du traitement des dates', error);
        }
    }
    static isBefore(startDate: string, endDate: string): boolean{
        try {
            const start = Utils.parseToFRDate(startDate);
            const end  = Utils.parseToFRDate(endDate);

            if(end < start) 
                throw new BadRequestException("La date de début doit être la date actuelle ou la date de future");

            return true;
        } catch (error) {
            throw new InternalServerErrorException('Erreur lors du traitement des dates');
        }
    }
    
    static parseToFRDate(date: string): Date{
        try {
            if(!date) throw new Error("La date est null");
            const parsed = parse(date, "yyyy-MM-dd", new Date());
    
            if(!isValid(parsed)) throw new BadRequestException(`Date:${date} invalide`);
            parsed.setUTCHours(0, 0, 0, 0);
            parsed.setDate(parsed.getDate() + 1);
    
            return parsed;
        } catch (error) {
            throw new Error(error);
        }
    }

    static isValidDateInterval(date_debut: string, date_fin: string){
        const startDate = Utils.parseToFRDate(date_debut);
        const endDate = Utils.parseToFRDate(date_fin);

        if(startDate > endDate) throw new BadRequestException("Date de debut doit être inferieur ou égal au date de fin!");

        return true;
    }

    static isValidStatus(statut: string, statuts: any){
        const statutArray = Object.values(statuts);

        if(statutArray.filter( s => s === statut).length === 0)
            throw new BadRequestException(`Statuts autorisés:${statutArray}`);

        return true;
    }

    static hashPassword(password: string): string {
        return  bcrypt.hashSync(password, 10);
    }

    static async generateUserQRCode(adresse_email, mot_de_passe): Promise<string>{
        const loginDetails = `${adresse_email}:${mot_de_passe}`;
        return await QRCode.toDataURL(loginDetails);
    }

    static reformatToPhoneNumber(phoneNumber: string){
        return phoneNumber.replaceAll(/\s+/g, '');
    }

    /**
     * Compare deux heure
     * @param heure1 
     * @param heure2 
     * @returns 0: les heures sont égaux, 0 < : l'heure1 est inférieur à l'heure2
     */
    static compareTwoTimes(heure1: string, heure2:string): number{
        const [h, m] = heure1.split(":").map(Number);
        const minutes1 = h * 60 + m;

        const [h2, m2] = heure2.split(":").map(Number);
        const minutes2 = h2 * 60 + m2;
        
        return minutes1 - minutes2;
    }
}