import { ClientService } from './../../modules/client/client.service';
import { CreateCreneauLivraisonDto } from 'src/common/dto/creneau-livraison/create-creneau-livraison-dto';
import { CategorieLivreurEnum } from 'src/common/enum/categorie-livreur.enum';
import { PrestataireService } from 'src/modules/prestataire/prestataire.service';
import { UserService } from './../../modules/user/user.service';
import { Injectable } from '@nestjs/common';
import { LivreurService } from 'src/modules/livreur/livreur.service';
import { PointLivraisonService } from 'src/modules/point-livraison/point-livraison.service';
import { ColisService } from 'src/modules/colis/colis.service';
import { PlanningLivraisonService } from 'src/modules/planning-livraison/planning-livraison.service';
import { TourneeLivraisonService } from 'src/modules/tournee-livraison/tournee-livraison.service';
import { BordereauLivraisonService } from 'src/modules/bordereau-livraison/bordereau-livraison.service';
import { PrestataireCreateDto } from 'src/common/dto/prestataire/create-prestataire-dto';
import { CreateUserDto } from 'src/common/dto/create-user-dto';
import { DefaulPrestataireAdminUserDto } from 'src/common/dto/prestataire/default-user-prestataire-dto';
import { CreateLivreurDto } from 'src/common/dto/livreur/create-livreur-dto';
import { CreatePointLivraisonDto } from 'src/common/dto/point-livraison/point-livraison-create-dto';
import { ContrainteLivraisonDto } from 'src/common/dto/contrainte-livraison/contrainte-livraison-dto';
import { ColisCreateDto } from 'src/common/dto/colis/create-colis-dto';
import { DetailColisDto } from 'src/common/dto/colis/detail-colis-dto';
import { PlanningLivraisonCreateDto } from 'src/common/dto/planning-livraison/create-planning-dto';
import { TourneeLivraisonCreateDto } from 'src/common/dto/tournee-livraison/create-tournee-livraison-dto';
import { UserRole } from 'src/common/enum/user-role.enum';
import { Livreur } from 'src/modules/livreur/livreur.entity';
import { Prestataire } from 'src/modules/prestataire/prestataire.entity';
import { User } from 'src/modules/user/user.entity';
import { LivraisonCreateDto } from 'src/common/dto/livraison/create-livraison-dto';
import { ClientCreateDto } from 'src/common/dto/client/client-create-dto';
import { DataSource } from 'typeorm';

@Injectable()
export class SeedService {
    constructor(
        readonly userService: UserService,
        readonly prestataireService: PrestataireService,
        readonly livreurService: LivreurService,
        readonly plService: PointLivraisonService,
        readonly colisService: ColisService,
        readonly livraisonService: LivreurService,
        readonly planningService: PlanningLivraisonService,
        readonly tourneeService: TourneeLivraisonService,
        readonly bordereauService: BordereauLivraisonService,
        readonly ClientService: ClientService,
        readonly dataSource: DataSource
    ){}

    async clearAll() {
        const entities = this.dataSource.entityMetadatas;
        const excludes = ["roles", "types_utilisateur", "categories_livreur"];

        try {
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


    async run() {
        const savedPrestataires: Prestataire[] = [];
        const savedLivreurs: Livreur[] = [];
        const savedPrestataireUsers: User[] = [];

        const tempoOneUsers = this.utilisateur();
        const livreurs = this.livreurs();
        
        try {
            await this.clearAll();
            // Sauvegarde des utilisateurs internes
            for (const user of tempoOneUsers) {
                await this.userService.saveInterneUser(user);
            }
    
            // Sauvegarde des prestataires + utilisateurs associés
            let userID = 0;
            const prestataires = this.prestataireData();
            const prestataireUsers = this.prestataireUtilisateur();
            for (let idx = 0; idx < prestataires.length; idx++) {
                const p = prestataires[idx];
                const saved = await this.prestataireService.create(p);
                savedPrestataires.push(saved);

                const respo = prestataireUsers[userID];
                const savedResp = await this.userService.savePrestataireUser(saved.id_prestataire, respo);
                savedPrestataireUsers.push(savedResp);
                
                
                userID++;
                const user = prestataireUsers[userID];
                const prestataireUser = await this.userService.savePrestataireUser(saved.id_prestataire, user);
                savedPrestataireUsers.push(prestataireUser);
                userID++;
            }
    
            //Sauvegarde des livreurs associés au 1er prestataire
            for (const livreur of livreurs) {
                const saved = await this.livreurService.create(savedPrestataires[0].id_prestataire, livreur);
                savedLivreurs.push(saved);
            }
    
            // Sauvegarde des points de livraison
            const pointsLivraison = this.pointsLivraison();
            const clients = this.clients();
            for (let i = 0; i < pointsLivraison.length; i++) {
                const savedPL = await this.plService.create(pointsLivraison[i]);
                clients[i].id_point_livraison = savedPL.id;
                await this.ClientService.save(clients[i]);
            }
    
            // Exemple pour colis / planning / tournée
            // await this.colisService.save(this.colis());
            // const planning = await this.planningService.saveDraftPlanning(this.plannings());
            // await this.tourneeService.save(planning.id, this.tournee(savedLivreurs[0].id_livreur));
    
            console.log("✅ Données de test insérées avec succès !");
            
        } catch (error) {
            console.error(error);
            await this.clearAll();
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

    private prestataireUtilisateur(): CreateUserDto[]{
        //Prestataire 1
        const responsableExploitation1: CreateUserDto = new CreateUserDto();
        responsableExploitation1.role = UserRole.ResponsableExploitation;
        responsableExploitation1.nom = "Rakoto";
        responsableExploitation1.prenom = "Be";
        responsableExploitation1.email = "rakoto.be@solutionsit.mg";
        responsableExploitation1.mot_de_passe = "Secur1tyPass!2023";

        const userPrestataire1: CreateUserDto = new CreateUserDto();
        userPrestataire1.role = UserRole.User;
        userPrestataire1.nom = "Ndiaye";
        userPrestataire1.prenom = "Andriana";
        userPrestataire1.email = "ndiaye.andriana2@solutionsit.mg";
        userPrestataire1.mot_de_passe = "InternePass!2023";
        
        
        //Prestataire 2
        const responsableExploitation2: CreateUserDto = new CreateUserDto();
        responsableExploitation2.role = UserRole.ResponsableExploitation;
        responsableExploitation2.nom = "Ravo";
        responsableExploitation2.prenom = "Nadia";
        responsableExploitation2.email = "ravo.nadia2@webdev-experts.mg";
        responsableExploitation2.mot_de_passe = "2WebDev@12345";

        const userPrestataire2: CreateUserDto = new CreateUserDto();
        userPrestataire2.role = UserRole.User;
        userPrestataire2.nom = "Tiana";
        userPrestataire2.prenom = "Tiana";
        userPrestataire2.email = "tiana.tiana2@webdev-experts.mg";
        userPrestataire2.mot_de_passe = "2InterneWebDevPass!2023";
        
        //Prestataire 3
        const responsableExploitation3: CreateUserDto = new CreateUserDto();
        responsableExploitation3.role = UserRole.ResponsableExploitation;
        responsableExploitation3.nom = "Rija";
        responsableExploitation3.prenom = "Andry";
        responsableExploitation3.email = "rija.andry2@digitalsolutions.mg";
        responsableExploitation3.mot_de_passe = "2D1g!t@lPass2023";

        const userPrestataire3: CreateUserDto = new CreateUserDto();
        userPrestataire3.role = UserRole.User;
        userPrestataire3.nom = "Faly";
        userPrestataire3.prenom = "Rakoto";
        userPrestataire3.email = "faly.rakoto2@digitalsolutions.mg";
        userPrestataire3.mot_de_passe = "InterneDigitalPass!2023";

        return [
            responsableExploitation1, userPrestataire1, 
            responsableExploitation2, userPrestataire2,
            responsableExploitation3, userPrestataire3
        ];
    }

    private prestataireData(): PrestataireCreateDto[] {
        //Prestataire 1
        const prestataire1: PrestataireCreateDto = new PrestataireCreateDto();
        const adminPrestataire1 = new DefaulPrestataireAdminUserDto();

        prestataire1.adresse_email = "contact@solutionsit.mg";
        prestataire1.adresse_principale = "Ankorondrano, Antananarivo";
        prestataire1.nif = "123456789";
        prestataire1.stat = "123-4567890";
        prestataire1.nom_entreprise = "Solutions IT Madagascar";
        prestataire1.numero_telephone = "+261 34 12 345 78";
        prestataire1.nom_image_logo = "solutionsit-logo.png";

        adminPrestataire1.nom = "Ramaro";
        adminPrestataire1.prenom = "lahy";
        adminPrestataire1.email = "ramaro.lahy@solutionsit.mg";
        adminPrestataire1.mot_de_passe = "Secur1tyPass!2023";
        adminPrestataire1.telephone = "+261 34 12 345 79";
        prestataire1.user = adminPrestataire1;

        //Prestataire 2
        const prestataire2: PrestataireCreateDto = new PrestataireCreateDto();
        const adminPrestataire2 = new DefaulPrestataireAdminUserDto();

        prestataire2.adresse_email = "contact@webdev-experts.mg";
        prestataire2.adresse_principale = "Behoririka, Antananarivo";
        prestataire2.nif = "987654321";
        prestataire2.stat = "987-6543210";
        prestataire2.nom_entreprise = "WebDev Experts";
        prestataire2.numero_telephone = "+261 32 23 567 89";
        prestataire2.nom_image_logo = "webdevexperts-logo.png";

        adminPrestataire2.nom = "Rova";
        adminPrestataire2.prenom = "Nadine";
        adminPrestataire2.email = "rova.nadine@webdev-experts.mg";
        adminPrestataire2.mot_de_passe = "WebDev@12345";
        adminPrestataire2.telephone = "+261 32 23 456 90";
        prestataire2.user = adminPrestataire2;

        //Prestataire 3
        const prestataire3: PrestataireCreateDto = new PrestataireCreateDto();
        const adminPrestataire3 = new DefaulPrestataireAdminUserDto();

        prestataire3.adresse_email = "contact@digitalsolutions.mg";
        prestataire3.adresse_principale = "Tsaralalana, Antananarivo";
        prestataire3.nif = "112233445";
        prestataire3.stat = "112-2334455";
        prestataire3.nom_entreprise = "Digital Solutions Madagascar";
        prestataire3.numero_telephone = "+261 33 45 678 91";
        prestataire3.nom_image_logo = "digitalsolutions-logo.png";

        adminPrestataire3.nom = "Rajao";
        adminPrestataire3.prenom = "marie";
        adminPrestataire3.email = "rajao.marie@digitalsolutions.mg";
        adminPrestataire3.mot_de_passe = "D1g!t@lPass2023";
        adminPrestataire3.telephone = "+261 33 45 678 92";
        prestataire3.user = adminPrestataire3;


        return [prestataire1, prestataire2, prestataire3];
    }

    private livreurs(): CreateLivreurDto[] {
        const livreurNovice: CreateLivreurDto = new CreateLivreurDto();
        const novice_info: CreateUserDto = new CreateUserDto();

        livreurNovice.id_categorie_livreur = CategorieLivreurEnum.Novice;
        novice_info.nom = "Livreur";
        novice_info.prenom = "Novice";
        novice_info.email = "livreur.novice@gmail.com";
        novice_info.mot_de_passe = "livreurNovice123!";
        livreurNovice.user = novice_info;

        const livreurPoncuel: CreateLivreurDto = new CreateLivreurDto();
        const ponctuel: CreateUserDto = new CreateUserDto();

        livreurPoncuel.id_categorie_livreur = CategorieLivreurEnum.Ponctuel;
        ponctuel.nom = "Livreur";
        ponctuel.prenom = "Ponctuel";
        ponctuel.email = "livreur.ponctuel@gmail.com";
        ponctuel.mot_de_passe = "livreurPoctuel123!";
        livreurPoncuel.user = ponctuel;

        const livreurRegulier: CreateLivreurDto = new CreateLivreurDto();
        const regulier: CreateUserDto = new CreateUserDto();

        livreurRegulier.id_categorie_livreur = CategorieLivreurEnum.Regulier;
        regulier.nom = "Livreur";
        regulier.prenom = "Regulier";
        regulier.email = "livreur.regulier@gmail.com";
        regulier.mot_de_passe = "livreurRegulier123!";
        livreurRegulier.user = regulier;
        
        return [livreurNovice, livreurPoncuel, livreurRegulier];
    }

    private pointsLivraison() {
        // Point de livraison 1
        const pl1 = new CreatePointLivraisonDto();
        pl1.numero_magasin = "Super U";
        pl1.code_postal = "101";
        pl1.nom_rue = "Avenue, pavillon";
        pl1.numero_rue = "12";
        pl1.ville = "Antananarivo";

        // Point de livraison 2 avec contrainte
        const pl2 = new CreatePointLivraisonDto();
        const contrainte1 = new ContrainteLivraisonDto();
        contrainte1.date_debut = "01/10/2025";
        contrainte1.date_fin = "02/10/2025";
        contrainte1.intitule_contrainte = "Contrainte 1";
        contrainte1.priorite_contrainte = "Normale";

        pl2.numero_magasin = "Jumbo Scoore";
        pl2.code_postal = "101";
        pl2.nom_rue = "Avenue, pavillon";
        pl2.numero_rue = "13";
        pl2.ville = "Antananarivo";
        pl2.contraintes_livraison = [contrainte1];

        // Point de livraison 3
        const pl3 = new CreatePointLivraisonDto();
        pl3.numero_magasin = "Carrefour";
        pl3.code_postal = "102";
        pl3.nom_rue = "Avenue des Nations";
        pl3.numero_rue = "8";
        pl3.ville = "Antananarivo";

        // Point de livraison 4 avec contrainte
        const pl4 = new CreatePointLivraisonDto();
        const contrainte2 = new ContrainteLivraisonDto();
        contrainte2.date_debut = "05/10/2025";
        contrainte2.date_fin = "06/10/2025";
        contrainte2.intitule_contrainte = "Contrainte 2";
        contrainte2.priorite_contrainte = "Haute";

        pl4.numero_magasin = "Leader Price";
        pl4.code_postal = "103";
        pl4.nom_rue = "Boulevard de l'Indépendance";
        pl4.numero_rue = "22";
        pl4.ville = "Antananarivo";
        pl4.contraintes_livraison = [contrainte2];

        // Point de livraison 5
        const pl5 = new CreatePointLivraisonDto();
        pl5.numero_magasin = "Monoprix";
        pl5.code_postal = "104";
        pl5.nom_rue = "Rue des Commerçants";
        pl5.numero_rue = "19";
        pl5.ville = "Antananarivo";

        // Point de livraison 6 avec contrainte
        const pl6 = new CreatePointLivraisonDto();
        const contrainte3 = new ContrainteLivraisonDto();
        contrainte3.date_debut = "10/10/2025";
        contrainte3.date_fin = "12/10/2025";
        contrainte3.intitule_contrainte = "Contrainte 3";
        contrainte3.priorite_contrainte = "Urgente";

        pl6.numero_magasin = "Hyper U";
        pl6.code_postal = "105";
        pl6.nom_rue = "Avenue des Républicains";
        pl6.numero_rue = "5";
        pl6.ville = "Antananarivo";
        pl6.contraintes_livraison = [contrainte3];

        // Retourner la liste des points de livraison
        return [pl1, pl2, pl3, pl4, pl5, pl6];
    }


    private colis(){
        const colis = new ColisCreateDto();
        const produit1 = new DetailColisDto();

        produit1.description_produit = " Korg X5D";
        produit1.poids_produit = 2;
        produit1.valeur_produit = 2000000;

        const produit2 = new DetailColisDto();

        produit2.description_produit = " Back line";
        produit2.poids_produit = 12;
        produit2.valeur_produit = 800000;

        colis.details_colis = [produit1, produit2];

        return colis;
    }

    private plannings(){
        const plannings = new PlanningLivraisonCreateDto();

        plannings.date_debut = "01/10/2025";
        plannings.date_fin = "06/10/2025";
        plannings.priorite_livraison = "Normale";
        return plannings;
    }

    private tournee(id){
        const tournee = new TourneeLivraisonCreateDto();

        tournee.date_tournee = "01/10/2025";
        tournee.heure_debut = "08:00";
        tournee.heure_fin = "12:30";
        tournee.id_livreur = id;

        return tournee;
    }

    private livraisons(){
        const livraison: LivraisonCreateDto = new LivraisonCreateDto();
    }

    private clients(): ClientCreateDto[]{
        const client1: ClientCreateDto = new ClientCreateDto();
        client1.nom_client = "Rasoanaivo";
        client1.prenom_client = "Miora";
        client1.civilite = "Mme";
        client1.numero_telephone = "+261 34 12 34 56 78";
        client1.adresse_mail = "miora.rasoanaivo@example.com";

        const client2: ClientCreateDto = new ClientCreateDto();
        client2.nom_client = "Rakoto";
        client2.prenom_client = "Jean";
        client2.numero_telephone = "+261 33 23 45 67 89";
        client2.adresse_mail = "jean.rakoto@example.com";

        const client3: ClientCreateDto = new ClientCreateDto();
        client3.nom_client = "Ramahefa";
        client3.prenom_client = "Tiana";
        client3.civilite = "Mlle";
        client3.numero_telephone = "+261 32 33 44 55 66";
        client3.adresse_mail = "tiana.ramahefa@example.com";


        const client4: ClientCreateDto = new ClientCreateDto();
        client4.nom_client = "Andriamifidy";
        client4.prenom_client = "Olga";
        client4.numero_telephone = "+261 34 11 22 33 44";
        client4.adresse_mail = "olga.andriamifidy@example.com";


        const client5: ClientCreateDto = new ClientCreateDto();
        client5.nom_client = "Ravelojaona";
        client5.prenom_client = "Naina";
        client5.civilite = "M.";
        client5.numero_telephone = "+261 32 01 23 45 67";
        client5.adresse_mail = "naina.ravelojaona@example.com";


        const client6: ClientCreateDto = new ClientCreateDto();
        client6.nom_client = "Rakotomalala";
        client6.prenom_client = "Rija";
        client6.numero_telephone = "+261 33 55 66 77 88";
        client6.adresse_mail = "rija.rakotomalala@example.com";

        return [client1, client2, client3, client4, client5, client6];
    }
}
