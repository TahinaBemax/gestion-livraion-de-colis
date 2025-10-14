
import { In, Repository } from 'typeorm';
import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CreatePointLivraisonDto } from 'src/common/dto/point-livraison/point-livraison-create-dto';
import { Prestataire } from '../prestataire/prestataire.entity';
import { PointLivraisonEntity } from './point-livraison.entity';
import { ContrainteLivraisonEntity } from '../contrainte-livraison/contrainte-livraison.entity';
import { ContrainteLivraisonDto } from 'src/common/dto/contrainte-livraison/contrainte-livraison-dto';
import { PointLivraisonUpdateDto } from 'src/common/dto/point-livraison/point-livraison-update-dto';
import { EvenementLocalService } from '../evenement-local/evenement-local.service';
import { Utils } from 'src/common/utils/utils';
import { parse } from 'date-fns';


@Injectable()
export class PointLivraisonService {
    constructor(
        @InjectRepository(PointLivraisonEntity)
        private readonly pointLivraisonRep: Repository<PointLivraisonEntity>,
        @InjectRepository(ContrainteLivraisonEntity)
        private readonly contrainteLivraisonRep: Repository<ContrainteLivraisonEntity>,
        private readonly eventService: EvenementLocalService,
    ){}



    async create(dto: CreatePointLivraisonDto): Promise<PointLivraisonEntity>{
        const pointLivraison: PointLivraisonEntity = this.mapDtoToPointLivraison(dto);

        const prepared = this.pointLivraisonRep.create(pointLivraison);
        return this.pointLivraisonRep.save(prepared);
    }

    async findAll(): Promise<PointLivraisonEntity[]> {
        return this.pointLivraisonRep.find({
            relations: ["contraintes_livraison", "evenements", "creneaux_livraison"]
        });
    }

    async findById(id:number): Promise<PointLivraisonEntity> {
        const matched = await this.pointLivraisonRep.findOne(
            {
                where: {id: id},
                relations: ["contraintes_livraison", "evenements", "creneaux_livraison"]
            }
        );

        if(!matched){
            throw new BadRequestException(`Point de Livraison avec id: ${id} introuvable!`) 
        } 

        return matched; 
    }

    async findByPrestataire(id:number): Promise<PointLivraisonEntity[]> {
        return this.pointLivraisonRep.createQueryBuilder("pl")
            .innerJoinAndSelect("pl.prestataire", "p")
            .leftJoinAndSelect("pl.evenements", "event")
            .leftJoinAndSelect("pl.contraintes_livraison", "cl")
            .leftJoinAndSelect("pl.creneaux_livraison", "creneaux")
            .where("p.id_prestataire = :id", {id: `${id}`})
            .getMany();
    }

    async findByClient(id:number): Promise<PointLivraisonEntity|null> {
        return this.pointLivraisonRep.createQueryBuilder("pl")
            .leftJoinAndSelect("pl.clients", "c")
            .leftJoinAndSelect("pl.evenements", "event")
            .leftJoinAndSelect("pl.contraintes_livraison", "cl")
            .leftJoinAndSelect("pl.creneaux_livraison", "creneaux")
            .where("c.id = :id", {id: `${id}`})
            .getOne();
    }

    async update(id: number, dto: PointLivraisonUpdateDto): Promise<PointLivraisonEntity>{
        if(!dto || !id) throw new BadRequestException("Données Invalides!");
        const matched = await this.findById(id);

        if(!matched) throw new NotFoundException(`Point de Livraison avec id:{${id}} est introuvable!`);

        matched.numero_magasin = dto.numero_magasin ?? matched.numero_magasin;
        matched.nom_rue = dto.nom_rue ?? matched.nom_rue;
        matched.numero_rue = dto.numero_rue ?? matched.numero_rue;
        matched.departement = dto.departement;
        matched.ville = dto.ville ?? matched.ville;
        matched.pays = dto.pays;
        matched.latitude = dto.latitude;
        matched.longitude = dto.longitude;
        matched.code_postal = dto.code_postal;
        matched.complement_adresse = dto.complement_adresse;

        return this.pointLivraisonRep.save(matched);
    }

    async findByCityNumeroMagasin(city: string, numMagasin: string): Promise<PointLivraisonEntity[]> {
        if(!city && !numMagasin) throw new BadRequestException("La ville et le numero de magasin sont obligatoire!");

        return this.pointLivraisonRep.createQueryBuilder("pl")
            .leftJoinAndSelect("pl.evenements", "event")
            .leftJoinAndSelect("pl.prestataire", "p")
            .leftJoinAndSelect("pl.contraintes_livraison", "cl")
            .leftJoinAndSelect("pl.creneaux_livraison", "creneaux")
            .where("pl.ville ILIKE :ville", {ville: `%${city}%`})
            .andWhere("pl.nom_point_livraison ILIKE :magasin", {magasin: `%${numMagasin}%`})
            .getMany();
    }


    async assignDeliveryPointsToProvider(prestataire: Prestataire, id_points_livraison:number[]): Promise<{message: string}>{
        if(!id_points_livraison || id_points_livraison.length === 0) throw new BadRequestException("Il faut mettre au moins un point de livraison!");
        const queryRunner = this.pointLivraisonRep.manager.connection.createQueryRunner();

        //start a transaction
        await queryRunner.startTransaction();
        try {
            const pls = await this.pointLivraisonRep.findBy({ id: In(id_points_livraison) });
            if(pls.length === 0) throw new BadRequestException(`Aucun point de livraison pour les identifiants: [${id_points_livraison.toString()}] trouvé!`)

            pls.forEach(pl => {
                if(pl.prestataire) throw new BadRequestException(`Le point de livraison ${pl.numero_magasin} est déja rattaché à un prestataire`);
                pl.prestataire = prestataire;
            });

            await queryRunner.manager.save(PointLivraisonEntity, pls);

            await queryRunner.commitTransaction();

            return {message: "Points de livraison rattachés avec succes!"};
        } catch (error) {
            await queryRunner.rollbackTransaction();
            throw error;
        } finally {
            await queryRunner.release();
        }
    }

    async assignDeliveryConstraintsToPL(idPL: number, constraintesDto: ContrainteLivraisonDto[]): Promise<string> {
        if(!idPL || constraintesDto.length === 0) throw new BadRequestException("Il faut mettre au moins une contrainte de livraison!");
        const existingPL = await this.findById(idPL);

        const queryRunner = this.contrainteLivraisonRep.manager.connection.createQueryRunner();

        //start a transaction
        await queryRunner.startTransaction();
        try {
            const constraints = this.mapContrainteLivraisonDtoToContrainteLivraisonEntity(constraintesDto);
            constraints.forEach( c => c.point_livraison = existingPL);

            await queryRunner.manager.save(ContrainteLivraisonEntity, constraints);
            await queryRunner.commitTransaction();

            return `Contrainte(s) temporelle de livraison rattachée(s) avec succes!`;
        } catch (error) {
            await queryRunner.rollbackTransaction();
            throw error;
        } finally {
            await queryRunner.release();
        }
    }

    async assignEventsConstraintToPL(idPL: number, eventsID: number[]): Promise<string> {
        if(!idPL || !eventsID || eventsID.length === 0) throw new BadRequestException("Il faut mettre au moins un evenement!");
        const existingPL: PointLivraisonEntity = await this.findById(idPL);
        const events = await this.eventService.findByIds(eventsID);
        const queryRunner = this.pointLivraisonRep.manager.connection.createQueryRunner();

        //start a transaction
        await queryRunner.startTransaction();
        try {
            if(existingPL.evenements){
                existingPL.evenements.concat(events);
            } else {
                existingPL.evenements =events;
            }
            
            await queryRunner.manager.save(PointLivraisonEntity, existingPL);
            await queryRunner.commitTransaction();

            return `Evenement rattaché sur le point de livraison avec succes!`;
        } catch (error) {
            await queryRunner.rollbackTransaction();
            throw error;
        } finally {
            await queryRunner.release();
        }
    }

    private mapDtoToPointLivraison(dto: CreatePointLivraisonDto): PointLivraisonEntity{
        const pl = new PointLivraisonEntity();

        pl.numero_magasin = dto.numero_magasin;
        pl.nom_rue = dto.nom_rue;
        pl.numero_rue = dto.numero_rue;
        pl.departement = dto.departement;
        pl.ville = dto.ville;
        pl.pays = dto.pays;
        pl.latitude = dto.latitude;
        pl.longitude = dto.longitude;
        pl.code_postal = dto.code_postal;
        pl.complement_adresse = dto.complement_adresse;

        if(dto.contraintes_livraison && dto.contraintes_livraison.length > 0){
            pl.contraintes_livraison = this.mapContrainteLivraisonDtoToContrainteLivraisonEntity(dto.contraintes_livraison);
        }

        return pl;
    }

    private mapContrainteLivraisonDtoToContrainteLivraisonEntity(dto: ContrainteLivraisonDto[]){
        if(dto && dto.length > 0){
            return dto.map(c => {
                const contrainte = new ContrainteLivraisonEntity();
                //Utils.isPresentOrFuture(c.date_contrainte)

                contrainte.intitule_contrainte = c.intitule_contrainte;
                contrainte.date_contrainte = c.date_contrainte;
                contrainte.heure_debut_livrable = c.heure_debut_livrrable;
                contrainte.heure_fin_livrable = c.heure_fin_livrrable;

                return contrainte;
            });
        }

        return [];
    }


}
