import { BadRequestException } from "@nestjs/common";
import { isValid, parse } from "date-fns";

export class Utils {
    static parseToFRDate(date: string): Date{
        const parsed = parse(date, "dd/MM/yyyy", new Date());

        if(!isValid(parsed)) throw new BadRequestException(`Date:${date} invalide`);
        parsed.setUTCHours(0, 0, 0, 0);

        return parsed;
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
}