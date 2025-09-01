
import { In, Repository } from 'typeorm';
import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CreatePointLivraisonDto } from 'src/common/dto/point-livraison/point-livraison-create-dto';
import { plainToInstance } from 'class-transformer';
import { Prestataire } from '../prestataire/prestataire.entity';
import { PointLivraisonEntity } from './point-livraison.entity';
import { ContrainteLivraisonEntity } from '../contrainte-livraison/contrainte-livraison.entity';


@Injectable()
export class PointLivraisonService {
    constructor(
        @InjectRepository(PointLivraisonEntity)
        private readonly pointLivraisonRep: Repository<PointLivraisonEntity>,
        @InjectRepository(ContrainteLivraisonEntity)
        private readonly contrainteLivraisonRep: Repository<ContrainteLivraisonEntity>,
    ){}


    async create(dto: CreatePointLivraisonDto): Promise<PointLivraisonEntity>{
        const pointLivraison: PointLivraisonEntity = this.mapDtoToPointLivraison(dto);

        const prepared = this.pointLivraisonRep.create(pointLivraison);
        return this.pointLivraisonRep.save(prepared);
    }

    async findAll(): Promise<PointLivraisonEntity[]> {
        return this.pointLivraisonRep.find({relations: ["contraintes_livraison", "contraintes_evenements"]});
    }

    async findById(id:number): Promise<PointLivraisonEntity> {
        const matched = await this.pointLivraisonRep.findOne(
            {
                where: {id: id},
                relations: ["contraintes_livraison", "contraintes_evenements"]
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
            .where("p.id_prestataire = :id", {id: `${id}`})
            .getMany();
    }

    async update(id: number, dto: CreatePointLivraisonDto): Promise<PointLivraisonEntity>{
        if(!dto || !id) throw new BadRequestException("Données Invalides!");
        const matched = this.findById(id);

        if(!matched) throw new NotFoundException(`Point de Livraison avec id:{${id}} est introuvable!`);

        const pointLivraison: PointLivraisonEntity = plainToInstance(PointLivraisonEntity, dto);
        pointLivraison.id = pointLivraison.id ?? id;

        const prepared = this.pointLivraisonRep.create(pointLivraison);
        return this.pointLivraisonRep.save(prepared);
    }

    async findByCityNumeroMagasin(city: string, numMagasin: string): Promise<PointLivraisonEntity[]> {
        if(!city && !numMagasin) throw new BadRequestException("La ville et le numero de magasin sont obligatoire!");

        return this.pointLivraisonRep.find({
            where: {ville: city, numero_magasin: numMagasin},
            relations: ["contraintes_livraison", "contraintes_evenements"]
        });
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

    async assignDeliveryConstraintsToPL(idPL: number, idConstraintes: number[]): Promise<{message: string}> {
        if(!idPL || idConstraintes.length === 0) throw new BadRequestException("Il faut mettre au moins une contrainte de livraison!");
        const existingPL = await this.findById(idPL);
        const queryRunner = this.contrainteLivraisonRep.manager.connection.createQueryRunner();

        //start a transaction
        await queryRunner.startTransaction();
        try {
            const constraints = await this.contrainteLivraisonRep.findBy({ id: In(idConstraintes) });
            if(constraints.length === 0) throw new BadRequestException(`Aucune contrainte de livraison pour les identifiants: [${idConstraintes.toString()}] trouvée!`)
             
            for (const c of constraints) {
                if(c.point_livraison) throw new BadRequestException(`${c.intitule_contrainte} est déja rattachéé à un point de livraison!`);
                c.point_livraison = existingPL;
            }

            await queryRunner.manager.save(PointLivraisonEntity, constraints);
            await queryRunner.commitTransaction();

            return {message: `Contrainte(s) temporelle de livraison rattachée(s) à ${existingPL.numero_magasin}  avec succes!`};
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
            const contraintes = dto.contraintes_livraison.map(c => {
                const contrainte = new ContrainteLivraisonEntity();

                contrainte.intitule_contrainte = c.intitule_contrainte;
                contrainte.date_debut = c.date_debut;
                contrainte.date_fin = c.date_fin;
                contrainte.priorite_contrainte = c.priorite_contrainte;

                return contrainte;
            })

            pl.contraintes_livraison = contraintes;
        }

        return pl;
    }
}
