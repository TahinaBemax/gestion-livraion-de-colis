import { BadRequestException, Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { Livreur } from './livreur.entity';
import { CreateLivreurDto } from 'src/common/dto/livreur/create-livreur-dto';
import { User } from '../user/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { LiveurMapper } from './livreur.mapper';
import * as QRCode from 'qrcode';

@Injectable()
export class LivreurService {
    constructor(
        @InjectRepository(Livreur)
        private readonly livreurRepo: Repository<Livreur>, 
        @InjectRepository(User)
        private readonly userRepo: Repository<User>,
        private readonly livreurMapper: LiveurMapper
    ){}

    async create(dto: CreateLivreurDto): Promise<Livreur> {
        const preparedData = await this.livreurMapper.prepareData(dto);
        const user = preparedData.user;
        const prestataire = await user.prestataire;
        
        if(!prestataire?.est_active) throw new BadRequestException("Compte Prestataire désactivé ne peut pas créer un Livreur!");
        
        const livreur = preparedData.livreur; 
        livreur.qr_code = this.generateQRCode(user);
        livreur.user = user;

        const prepared = this.livreurRepo.create(livreur);
        return this.livreurRepo.save(prepared);
    }

    async findAllLivreurs(): Promise<Livreur[]>{
        return this.livreurRepo.find({relations: ["user"]});
    }

    async findAllLivreursByPrestataire(id:number): Promise<Livreur[]>{
        return this.livreurRepo
            .createQueryBuilder('livreur')
            .leftJoinAndSelect('livreur.user', 'user')
            .leftJoinAndSelect('user.prestataire', 'prestataire')
            .where('prestataire.id_prestataire = :id', { id })
            .getMany();
    }

    async findById(id:number): Promise<Livreur>{
        const livreur = await this.livreurRepo.findOne({
            where: {id_livreur: id},
            relations: ["user"]
        });

        if(!livreur) throw new NotFoundException(`Livreur id:${id} Introuvable`);
        return livreur;
    }

    async changeAccountStatus(id_prestataire:number, id: number, isActivate:boolean): Promise<{message: string}>{
        const matched = await this.findById(id);
        const prestataire = await matched.user.prestataire;
        if(id_prestataire != prestataire?.id_prestataire) 
            throw new UnauthorizedException("Vous n'avez pas le droit de modifier ce livreur!");

        if(matched.user.est_active !== isActivate){
            matched.user.est_active = isActivate;
            this.userRepo.save(matched.user);
        }

        return {message: `Compte Livreur ${(isActivate) ? 'activé': 'desactivé'} avec succés!`};
    }

    async canScan(id_prestataire:number, id: number, canScan: boolean): Promise<{message: string}>{
        const matched = await this.findById(id);
        const prestataire = await matched.user.prestataire;
        if(id_prestataire != prestataire?.id_prestataire) 
            throw new UnauthorizedException("Vous n'avez pas le droit de modifier ce livreur!");

        matched.peut_faire_chargement_colis = canScan;
        this.livreurRepo.save(matched);

        return {message: `Scan au moment du chargement du camion ${(canScan) ? 'activé' : 'desactivé'} avec succés!`};
    }


    async update(id_prestataire: number, livreur: Livreur):Promise<Livreur> {
        const matched = await this.findById(livreur.id_livreur);

        if(id_prestataire !== (await matched.user.prestataire)?.id_prestataire) 
            throw new BadRequestException("Vous n'avez pas le droit de modifier ce livreur!");

        const prepared = this.livreurRepo.create(livreur);
        return this.livreurRepo.save(prepared);
    }

    generateQRCode(user: User): string{
        const loginDetails = `${user.login}:${user.mot_de_passe}`;
        return QRCode.toDataUrl(loginDetails);
    }

}
