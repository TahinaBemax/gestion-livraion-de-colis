import { ProblemeColisCreateDto } from './../../common/dto/colis/create-probleme-colis-dto';
import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { LivraisonEntity } from './livraison.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { ColisEntity } from '../colis/colis.entity';
import { PointLivraisonEntity } from '../point-livraison/point-livraison.entity';
import { LivraisonCreateDto } from 'src/common/dto/livraison/create-livraison-dto';
import { Utils } from 'src/common/utils/utils';
import { plainToInstance } from 'class-transformer';
import { StatusLivraison } from 'src/common/enum/status-livraison.enum';
import { ProblemeLivraisonCreateDto } from 'src/common/dto/livraison/create-probleme-livraison-dto';
import { ProblemeLivraisonEntity } from './probleme-livraison.entity';

@Injectable()
export class LivraisonsService {
    constructor(
        @InjectRepository(LivraisonEntity)
        private readonly livraisonRep: Repository<LivraisonEntity>,
        @InjectRepository(ColisEntity)
        private readonly colisRep: Repository<ColisEntity>,
        @InjectRepository(PointLivraisonEntity)
        private readonly plRep: Repository<PointLivraisonEntity>,
        @InjectRepository(ProblemeLivraisonEntity)
        private readonly problemeLivraisonRep: Repository<ProblemeLivraisonEntity>
    ){}

    async findAll(): Promise<LivraisonEntity[]>{
        return this.livraisonRep.find({
            relations: ["point_livraison", "colis"]
        });
    }

    async findById(id: number): Promise<LivraisonEntity>{
        if(!id) throw new BadRequestException("ID invalide");
        
        const matched = await this.livraisonRep.findOne({
            where: {id: id},
            relations: ["point_livraison", "colis"]
        });

        if(!matched) throw new NotFoundException(`Livraison avec ID:{${id}} est introuvable!`);

        return matched;
    }
    
    async save(dto: LivraisonCreateDto): Promise<LivraisonEntity>{
        if(!dto) throw new BadRequestException("Données invalides");

        const date = Utils.parseToFRDate(dto.date_livraison);
        const livraison = plainToInstance(LivraisonEntity, dto);
        const colis = await this.colisRep.findOne({where: {id: dto.id_colis}});
        const pl = await this.plRep.findOne({where: {id: dto.id_point_livraison}});

        if(!colis) throw new NotFoundException(`Colis avec ID:{${dto.id_colis}} est introuvable!`);
        if(!pl) throw new NotFoundException(`Point de livraison avec ID:{${dto.id_point_livraison}} est introuvable!`);

        livraison.date_livraison = date;
        livraison.status = StatusLivraison.EN_ATTENTE;
        livraison.colis = colis;
        livraison.point_livraison = pl;

        const prepared = this.livraisonRep.create(livraison);
        return this.livraisonRep.save(prepared);
    }

    async update(id: number, dto: LivraisonCreateDto): Promise<LivraisonEntity>{
        if(!dto || !id) throw new BadRequestException("Données invalides");
        
        const existing = await this.findById(id);
        const date = Utils.parseToFRDate(dto.date_livraison);
        const colis = await this.colisRep.findOne({where: {id: dto.id_colis}});
        const pl = await this.plRep.findOne({where: {id: dto.id_point_livraison}});

        if(!colis) throw new NotFoundException(`Colis avec ID:{${dto.id_colis}} est introuvable!`);
        if(!pl) throw new NotFoundException(`Point de livraison avec ID:{${dto.id_point_livraison}} est introuvable!`);

        existing.notes = dto.notes;
        existing.date_livraison = date;
        existing.heure_debut = dto.heure_debut;
        existing.heure_fin = dto.heure_fin;
        existing.rue = dto.rue;
        existing.ville = dto.ville;
        existing.pays = dto.pays;
        existing.code_postal = dto.code_postal;
        existing.status = StatusLivraison.EN_ATTENTE;
        existing.colis = colis;
        existing.point_livraison = pl;

        return this.livraisonRep.save(existing);
    }

    async signalProbleme(id: number, dto: ProblemeLivraisonCreateDto): Promise<ProblemeLivraisonEntity>{
        if(!dto || !id) throw new BadRequestException("Données invalides");
        const existing = await this.findById(id);

        const probleme:ProblemeLivraisonEntity = plainToInstance(ProblemeLivraisonEntity, dto);
        probleme.livraison = existing;
        const prepared = this.problemeLivraisonRep.create(probleme);

        return this.problemeLivraisonRep.save(prepared);
    }
}
