import { BordereauLivraisonEntity } from './bordereau-livraison.entity';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { BordereauLivraisonCreateDto } from 'src/common/dto/bordereau-livraison/create-bordereau-livraison-dto';
import { Repository, In } from 'typeorm';
import { OrdreLivraisonEntity } from '../ordre-livraison/ordre-livraison.entity';

@Injectable()
export class BordereauLivraisonService {
    constructor(
        @InjectRepository  (BordereauLivraisonEntity)
        private readonly bordereauRep: Repository<BordereauLivraisonEntity>, 
        @InjectRepository  (OrdreLivraisonEntity)
        private readonly ordreRep: Repository<OrdreLivraisonEntity>, 
    ) {}


    create(data: BordereauLivraisonCreateDto): any {
        const ordresLivraison = this.ordreRep.findBy({ id: In(data.id_ordre_livraison)});
        return null;
    }

    async findAll(): Promise<BordereauLivraisonEntity[]> {
        return this.bordereauRep.find({relations: ['ordres_livraison' ,'livreurs']});
    }

    findById(id: number): any {
        return this.bordereauRep.find({
            where: { id: id },
            relations: ['ordres_livraison' ,'livreurs']
        });
    }

    // update(id: number, updateData: any): any {
    //     const index = this.bordereaux.findIndex(b => b.id === id);
    //     if (index === -1) return null;
    //     this.bordereaux[index] = { ...this.bordereaux[index], ...updateData };
    //     return this.bordereaux[index];
    // }

    // remove(id: number): boolean {
    //     const index = this.bordereaux.findIndex(b => b.id === id);
    //     if (index === -1) return false;
    //     this.bordereaux.splice(index, 1);
    //     return true;
    // }
}
