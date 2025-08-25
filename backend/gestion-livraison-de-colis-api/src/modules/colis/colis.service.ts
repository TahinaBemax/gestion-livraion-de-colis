import { ProblemeColisCreateDto } from './../../common/dto/colis/create-probleme-colis-dto';
import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { ColisEntity } from './colis.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { ColisCreateDto } from 'src/common/dto/colis/create-colis-dto';
import { plainToInstance } from 'class-transformer';
import { DetailColisDto } from 'src/common/dto/colis/detail-colis-dto';
import * as QRCode from 'qrcode';
import { StatusColis } from 'src/common/enum/status-colis.enum';
import { ColisUpdateDto } from 'src/common/dto/colis/update-colis-dto';
import { DetailColisEntity } from './detail-colis.entity';
import { ProblemeColisEntity } from './probleme-colis.entity';
import { LivraisonEntity } from '../livraisons/livraison.entity';

@Injectable()
export class ColisService {
    constructor(
        @InjectRepository(ColisEntity)
        private readonly colisRep: Repository<ColisEntity>,
        @InjectRepository(ProblemeColisEntity)
        private readonly problemeRep: Repository<ProblemeColisEntity>,
        @InjectRepository(LivraisonEntity)
        private readonly livraisonRep: Repository<LivraisonEntity>
    ){}

    async findAll(): Promise<ColisEntity[]>
    {
        return this.colisRep.find({relations: ["details_colis"]});
    }

    async findById(id: number): Promise<ColisEntity>
    {
        const mathced = await this.colisRep.findOne({
            where: {id: id},
            relations: ["details_colis"]
        });

        if(!mathced) throw new NotFoundException(`Colis avec ID:{${id}} est introuvable!`);

        return mathced;
    }

    async findByCode_barre(code: string): Promise<ColisEntity>
    {
        const mathced = await this.colisRep.findOne({
            where: {code_barre_colis: code},
            relations: ["details_colis"]
        });

        if(!mathced) throw new NotFoundException(`Colis introuvable!`);

        return mathced;
    }

    async findByCodeBarreClient(code: string): Promise<ColisEntity>
    {
        const mathced = await this.colisRep.findOne({
            where: {code_barre_colis: code},
            relations: ["details_colis"]
        });

        if(!mathced) throw new NotFoundException(`Colis introuvable!`);

        return mathced;
    }

    async save(dto: ColisCreateDto): Promise<ColisEntity> {
        if(!dto) throw new BadRequestException("Données Colis invalides!");

        const colis: ColisEntity = plainToInstance(ColisEntity, dto); 
        colis.statut_colis = StatusColis.EN_ATTENTE;
        colis.poids_total = this.getSumWeight(dto.details_colis);

        const queryRunner = this.colisRep.manager.connection.createQueryRunner();
        await queryRunner.connect();
        await queryRunner.startTransaction();

        try {
            const savedColis = await queryRunner.manager.save(ColisEntity, colis);

            savedColis.code_barre_client_colis = await this.generateCodeBarreClient(savedColis);
            savedColis.code_barre_colis = await this.generateCodeBarre(savedColis);

            const updated = await queryRunner.manager.save(ColisEntity, savedColis);
            await queryRunner.commitTransaction()

            return updated;
        } catch (error) {
            await queryRunner.rollbackTransaction();
            throw error;
        } finally {
            await queryRunner.release();
        }
    }

    async update(id: number, dto: ColisUpdateDto): Promise<ColisEntity>{
        if(!id || !dto) throw new BadRequestException("Données Colis invalides!");

        const existing = await this.findById(id);
        
        existing.poids_total = this.getSumWeight(dto.details_colis);
        existing.nom_destinataire = dto.nom_destinataire;
        existing.statut_colis = dto.status;
        existing.details_colis = plainToInstance(DetailColisEntity, dto.details_colis);
        
        return this.colisRep.save(existing);
    }
    
    async signalProbleme(id: number, dto: ProblemeColisCreateDto): Promise<ProblemeColisEntity>{
        if(!id || !dto) throw new BadRequestException("Données Colis invalides!");
        
        const existing = await this.findById(id);
        const probleme = plainToInstance(ProblemeColisEntity, dto);
        probleme.colis = existing;

        const prepared = this.problemeRep.create(probleme);
        return this.problemeRep.save(prepared);
    }

    async delete(id: number):Promise<string>{
        if(!id) throw new BadRequestException("ID colis invalide!");
        const existing = await this.findById(id); 
        
        await this.colisRep.delete(id);
        return "Colis supprimé avec succés"!
    }

    private getSumWeight(detailsColis: DetailColisDto[]) {
        let sum = 0;
        if(!detailsColis || detailsColis.length === 0) return sum;

        detailsColis.forEach(d => {
            sum += d.poids_produit;
        });

        return sum;
    }

    private async generateCodeBarre(colis: ColisEntity): Promise<string> {
        const data: string = `${colis.id}`;
        
        return QRCode.toDataURL(data);
    }

    private async generateCodeBarreClient(colis: ColisEntity): Promise<string> {
        const data: string = `${colis.id}:${colis.nom_destinataire}`;
        
        return QRCode.toDataURL(data);
    }
}
