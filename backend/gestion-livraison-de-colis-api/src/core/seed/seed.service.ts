import { ClientService } from './../../modules/client/client.service';
import { PrestataireService } from 'src/modules/prestataire/prestataire.service';
import { UserService } from './../../modules/user/user.service';
import { Injectable } from '@nestjs/common';
import { LivreurService } from 'src/modules/livreur/livreur.service';
import { PointLivraisonService } from 'src/modules/point-livraison/point-livraison.service';
import { ColisService } from 'src/modules/colis/colis.service';
import { TourneeLivraisonService } from 'src/modules/tournee-livraison/tournee-livraison.service';
import { BordereauLivraisonService } from 'src/modules/bordereau-livraison/bordereau-livraison.service';
import { CreateUserDto } from 'src/common/dto/create-user-dto';
import { UserRole } from 'src/common/enum/user-role.enum';
import { Prestataire } from 'src/modules/prestataire/prestataire.entity';
import { DataSource } from 'typeorm';
import { PrestataireDataTest } from './prestataire-data/prestataire-data-test';
import { PointLivraisonDataTest } from './point-livraison-data/point-livraison-data-test';
import { CreneauLivraisonEntity } from 'src/modules/creneau-livraison/creneau-livraison.entity';
import { ClientDataTest } from './client-data/client-data-test';
import { PointLivraisonEntity } from 'src/modules/point-livraison/point-livraison.entity';
import { ClientEntity } from 'src/modules/client/client.entity';
import { LivraisonDataTest } from './livraison-data/livraison-data-test';
import { LivraisonCreateDto } from 'src/common/dto/livraison/create-livraison-dto';
import { LivraisonsService } from 'src/modules/livraisons/livraisons.service';

@Injectable()
export class SeedService {
    constructor(
        readonly userService: UserService,
        readonly prestataireService: PrestataireService,
        readonly livreurService: LivreurService,
        readonly plService: PointLivraisonService,
        readonly colisService: ColisService,
        readonly livraisonService: LivraisonsService,
        readonly tourneeService: TourneeLivraisonService,
        readonly bordereauService: BordereauLivraisonService,
        readonly ClientService: ClientService,
        readonly dataSource: DataSource
    ){}

    async run() {
        try {
            // Nettoyer la base de données avant d'insérer les données de test
            await this.clearAll();

            // Insérer les données de test
            this.saveTempoOneUser();
            const savedPrestataires: Prestataire[] = await this.savePrestataireWithPrestataireUser();
            
            await this.saveLivreur(savedPrestataires[0].id_prestataire);
            const savedPointLivraison = await this.savePointLivraison();

            const savedClients = await this.saveClient(savedPointLivraison);
            await this.saveLivraison(savedClients);
    
            console.log("✅ Données de test insérées avec succès !");
        } catch (error) {
            console.error(error);
            await this.clearAll();
        }
    }

    async clearAll() {
        const entities = this.dataSource.entityMetadatas;
        const excludes = ["roles", "types_utilisateur", "categories_livreur"];

        try {
            this.dataSource.createQueryRunner().query("ALTER SEQUENCE ref_bordereau RESTART WITH 1");
            for (const entity of entities) {
                const repository = this.dataSource.getRepository(entity.name);
                const tableName = entity.tableName;
                
                if(!excludes.includes(tableName)){
                    await repository.query(`TRUNCATE TABLE "${tableName}" RESTART IDENTITY CASCADE;`);
                }
            }

            console.log('🗑️ Toutes les données ont été supprimées et les IDs réinitialisés !');
        } catch (error) {
            console.error('❌ Erreur clearAll:', error);
        }
    }

    private async saveTempoOneUser(){
        const tempoOneUsers = this.utilisateur();
        // Sauvegarde des utilisateurs internes
        for (const user of tempoOneUsers) {
            await this.userService.saveInterneUser(user);
        }
    }

    private async savePrestataireWithPrestataireUser(): Promise<Prestataire[]>{
        // Sauvegarde des prestataires + utilisateurs associés
        const savedPrestataires: Prestataire[] = [];

        let userID = 0;
        const prestataires = PrestataireDataTest.getListPrestataire();
        const prestataireUsers = PrestataireDataTest.getPrestataireUtilisateur();
        for (let idx = 0; idx < prestataires.length; idx++) {
            const p = prestataires[idx];
            const saved = await this.prestataireService.create(p);
            savedPrestataires.push(saved);

            // Utilisateur responsable exploitation
            const respo = prestataireUsers[userID];
            await this.userService.savePrestataireUser(saved.id_prestataire, respo);
            userID++;

            // Utilisateur simple
            const user = prestataireUsers[userID];
            await this.userService.savePrestataireUser(saved.id_prestataire, user);
            userID++;
        }

        return savedPrestataires
    }

    private async saveLivreur(idPrestataire: number){
        //Sauvegarde des livreurs associés au 1er prestataire 
        const livreurs = PrestataireDataTest.getLivreurs();
        for (const livreur of livreurs) {
            await this.livreurService.create(idPrestataire, livreur);
        }
    }

    private async savePointLivraison(){
        // Sauvegarde des points de livraison
        const savedPointLivraison:PointLivraisonEntity[] = [];
        const pointsLivraison = PointLivraisonDataTest.getListPointLivraison();
        // const saveCreneauLivraison = async (pl: PointLivraisonEntity) => {
        //     const creneaux: CreneauLivraisonEntity[] = PointLivraisonDataTest.getDefaultCreneauLivraison(pl);  
        //     await this.dataSource.manager.save(creneaux); 
        // }

        //for (let i = 0; i < pointsLivraison.length; i++) {
        //PL 1
            const savedPL1 = await this.plService.create(pointsLivraison[0]);
            const creneauxPL1: CreneauLivraisonEntity[] = PointLivraisonDataTest.getDefaultCreneauLivraison(savedPL1);  
            await this.dataSource.manager.save(creneauxPL1); 
            savedPointLivraison.push(savedPL1);

        //PL 2
            const savedPL2 = await this.plService.create(pointsLivraison[1]);
            const creneauxPL2: CreneauLivraisonEntity[] = PointLivraisonDataTest.getDefaultCreneauLivraison2(savedPL2);  
            await this.dataSource.manager.save(creneauxPL2); 
            savedPointLivraison.push(savedPL2);
        //}

        //PL 3
            const savedPL3 = await this.plService.create(pointsLivraison[2]);
            const creneauxPL3: CreneauLivraisonEntity[] = PointLivraisonDataTest.getDefaultCreneauLivraison3(savedPL3);  
            await this.dataSource.manager.save(creneauxPL3);
            savedPointLivraison.push(savedPL3);
        //}

        return savedPointLivraison
    }

    private async saveClient(pointsLivraison: PointLivraisonEntity[]){
        // Sauvegarde des points de livraison
        const clients = ClientDataTest.getClients();
        const savedClients: ClientEntity[] = [];
        let indicePL = 0;

        for (let i = 0; i < clients.length; i++) {
            if(i % 2 === 0 && i !== 0){
                indicePL++;
            }

            clients[i].id_point_livraison = pointsLivraison[indicePL].id;
            const saved = await this.ClientService.save(clients[i]);

            savedClients.push(saved);
        }

        return savedClients;
    }

    private async saveLivraison(clients: ClientEntity[]){
        // Sauvegarde des points de livraison
        const livraisons1: LivraisonCreateDto[] = LivraisonDataTest.getListLivraisonPointLivraion1(clients[0].id);
        const livraisons3: LivraisonCreateDto[] = LivraisonDataTest.livraison2(clients[1].id);
        const livraisons2: LivraisonCreateDto[] = LivraisonDataTest.getListLivraisonPointLivraion2(clients[2].id);
        const all = livraisons1.concat(livraisons2, livraisons3);
        for (const livraison of all) {
            await this.livraisonService.save(livraison);
        }
    }



    private utilisateur(): CreateUserDto[]{
        const adminTempoOne: CreateUserDto = new CreateUserDto();
        adminTempoOne.nom = "Admin";
        adminTempoOne.prenom = "Tempo One";
        adminTempoOne.role = UserRole.Admin;
        adminTempoOne.email = "admin@gmail.com";
        adminTempoOne.mot_de_passe = "AdminPassword!123";
        
        const userTempoOne: CreateUserDto = new CreateUserDto();
        userTempoOne.role = UserRole.User;
        userTempoOne.nom = "Utilisateur";
        userTempoOne.prenom = "Interne";
        userTempoOne.email = "tempo.one01@gmail.com";
        userTempoOne.mot_de_passe = "UserInterne!113";

        return [adminTempoOne, userTempoOne];
    }
}
