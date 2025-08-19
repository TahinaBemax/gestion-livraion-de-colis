import { BadRequestException } from "@nestjs/common";
import { isValid, parse } from "date-fns";

export class Utils {
    static parseToFRDate(date: string): Date{
        const parsed = parse(date, "dd/MM/yyyy", new Date());

        if(!isValid(parsed)) throw new BadRequestException(`Date:${date} invalide`);
        parsed.setUTCHours(0, 0, 0, 0);

        return parsed;
    }
}