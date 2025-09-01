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

@Injectable()
export class SeedService {
    constructor(
        readonly userService: UserService,
        readonly prestataireService: PrestataireService,
        readonly livreurService: LivreurService,
        readonly plService: PointLivraisonService,
        readonly colisService: ColisService,
        readonly planningService: PlanningLivraisonService,
        readonly tourneeService: TourneeLivraisonService,
        readonly bordereauService: BordereauLivraisonService
    ){}
    async run(){
        this.userService.saveInterneUser(this.utilisateur());
        const prestataire = await this.prestataireService.create(this.prestataireData());
        const livreur = await this.livreurService.create(prestataire.id_prestataire,this.livreur());
        this.pointLivraison().forEach(pl => {
            this.plService.create(pl);
        });
        this.colisService.save(this.colis());
        const planning = await this.planningService.saveDraftPlanning(this.plannings());
        this.tourneeService.save(planning.id, this.tournee(livreur.id_livreur));
        console.log('✅ Données de test insérées avec succès !');
    }
    
    private utilisateur(): CreateUserDto{
        const adminTempoOne: CreateUserDto = new CreateUserDto();

        adminTempoOne.nom = "Admin";
        adminTempoOne.prenom = "Tempo One";
        adminTempoOne.email = "admin@gmail.com";
        adminTempoOne.mot_de_passe = "AdminPassword!123";

        return adminTempoOne;
    }

    private prestataireData(): PrestataireCreateDto {
        const prestataire: PrestataireCreateDto = new PrestataireCreateDto();

        prestataire.adresse_email = "prestataire@gmail.com";
        prestataire.adresse_principale = "Analakely";
        prestataire.nif = "123456789";
        prestataire.stat = "123-4567890";
        prestataire.nom_entreprise = "Adriware Consulting";
        prestataire.numero_telephone = "+261 32 00 000 00";
        prestataire.nom_image_logo = "logo.png";

        const adminPrestataire = new DefaulPrestataireAdminUserDto();

        adminPrestataire.nom = "Admin";
        adminPrestataire.prenom = "Tempo One";
        adminPrestataire.email = "admin@gmail.com";
        adminPrestataire.mot_de_passe = "AdminPassword!123";
        adminPrestataire.telephone = "+261 32 00 000 00";

        prestataire.user = adminPrestataire;

        return prestataire;
    }

    private livreur(): CreateLivreurDto {
        const livreur: CreateLivreurDto = new CreateLivreurDto();

        livreur.id_categorie_livreur = "CAT-LIVREUR-00001";

        const userLivreur: CreateUserDto = new CreateUserDto();

        userLivreur.nom = "Livreur";
        userLivreur.prenom = "Novice";
        userLivreur.email = "livreur@gmail.com";
        userLivreur.mot_de_passe = "livreurPassword!123";

        livreur.user = userLivreur;
        return livreur;
    }

    private pointLivraison() {
        const pl1 = new CreatePointLivraisonDto();

        pl1.numero_magasin = "Super U";
        pl1.code_postal = "101";
        pl1.nom_rue = "Avenue, pavillon";
        pl1.numero_rue = "12";
        pl1.ville = "Antananarivo";

        const pl2 = new CreatePointLivraisonDto();
        const contrainte = new ContrainteLivraisonDto();

        contrainte.date_debut = "01/10/2025";
        contrainte.date_fin = "02/10/2025";
        contrainte.intitule_contrainte = "Contrainte 1";
        contrainte.priorite_contrainte = "Normale";

        pl2.numero_magasin = "Jumbo Scoore";
        pl2.code_postal = "101";
        pl2.nom_rue = "Avenue, pavillon";
        pl2.numero_rue = "13";
        pl2.ville = "Antananarivo";
        pl2.contraintes_livraison = [contrainte];

        return [pl1, pl2];
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
}
