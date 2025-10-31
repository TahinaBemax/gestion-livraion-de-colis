import { ContrainteLivraisonDto } from "src/common/dto/contrainte-livraison/contrainte-livraison-dto";
import { CreatePointLivraisonDto } from "src/common/dto/point-livraison/point-livraison-create-dto";
import { CreneauLivraisonEntity } from "src/modules/creneau-livraison/creneau-livraison.entity";
import { PointLivraisonEntity } from "src/modules/point-livraison/point-livraison.entity";

export class PointLivraisonDataTest {
    
    static getListPointLivraison() {
        // ++++ Point de livraison 1 ++++++
        const pl1 = new CreatePointLivraisonDto();
        pl1.numero_magasin = "Super U";
        pl1.code_postal = "101";
        pl1.nom_rue = "Avenue, pavillon";
        pl1.numero_rue = "12";
        pl1.ville = "Antananarivo";

        // Point de livraison 2 avec contrainte
        const pl2 = new CreatePointLivraisonDto();
        const contrainte1 = new ContrainteLivraisonDto();

        const now = new Date()
        //contrainte1.date_contrainte = `${now.getDate()}/${now.getMonth()}/${now.getFullYear()}`;
        contrainte1.date_contrainte = `${now.getDate()}/${now.getMonth() + 1}/${now.getFullYear()}`;
        
        contrainte1.intitule_contrainte = "Fermeture de la boutique";
        contrainte1.heure_debut_livrrable = "10:00:00";
        contrainte1.heure_fin_livrrable = "12:00:00";

        pl2.numero_magasin = "Jumbo Scoore";
        pl2.code_postal = "101";
        pl2.nom_rue = "Avenue, pavillon";
        pl2.numero_rue = "13";
        pl2.ville = "Antananarivo";
        pl2.contraintes_livraison = [contrainte1];

        // Point de livraison 3
        const pl3 = new CreatePointLivraisonDto();
        pl3.numero_magasin = "Analakely";
        pl3.code_postal = "101";
        pl3.nom_rue = "Avenue des Nations";
        pl3.numero_rue = "8";
        pl3.ville = "Antananarivo";

        // Retourner la liste des points de livraison
        return [pl1, pl2, pl3];
    }

    static getDefaultCreneauLivraison(pointLivraison: PointLivraisonEntity): CreneauLivraisonEntity[] {
        const lundi = new CreneauLivraisonEntity();
        lundi.annee = new Date().getFullYear()
        lundi.heure_debut = "07:00:00";
        lundi.heure_fin = "09:30:00";
        lundi.jour_semaine = "Lundi";
        lundi.point_livraison = pointLivraison;
                
        const mardi = new CreneauLivraisonEntity();
        mardi.annee = new Date().getFullYear()
        mardi.heure_debut = "07:00:00";
        mardi.heure_fin = "09:30:00";
        mardi.jour_semaine = "Mardi";
        mardi.point_livraison = pointLivraison;

        const mercredi = new CreneauLivraisonEntity();
        mercredi.annee = new Date().getFullYear()
        mercredi.heure_debut = "07:00:00";
        mercredi.heure_fin = "09:30:00";
        mercredi.jour_semaine = "Mercredi";
        mercredi.point_livraison = pointLivraison;
                    
        const Jeudi = new CreneauLivraisonEntity();
        Jeudi.annee = new Date().getFullYear()
        Jeudi.heure_debut = "07:00:00";
        Jeudi.heure_fin = "09:30:00";
        Jeudi.jour_semaine = "Jeudi";
        Jeudi.point_livraison = pointLivraison;

        const Vendredi = new CreneauLivraisonEntity();
        Vendredi.annee = new Date().getFullYear()
        Vendredi.heure_debut = "07:00:00";
        Vendredi.heure_fin = "09:30:00";
        Vendredi.jour_semaine = "Vendredi";
        Vendredi.point_livraison = pointLivraison;

        const Samedi = new CreneauLivraisonEntity();
        Samedi.annee = new Date().getFullYear()
        Samedi.heure_debut = "08:00:00";
        Samedi.heure_fin = "09:30:00";
        Samedi.jour_semaine = "Samedi";
        Samedi.point_livraison = pointLivraison;

        const dimanche = new CreneauLivraisonEntity();
        dimanche.annee = new Date().getFullYear()
        dimanche.heure_debut = "08:00:00";
        dimanche.heure_fin = "09:30:00";
        dimanche.jour_semaine = "Dimanche";
        dimanche.point_livraison = pointLivraison;

        return [lundi, mardi, mercredi, Jeudi, Vendredi, Samedi, dimanche];
    }    

    static getDefaultCreneauLivraison2(pointLivraison: PointLivraisonEntity): CreneauLivraisonEntity[] {
        const lundi = new CreneauLivraisonEntity();
        lundi.annee = new Date().getFullYear()
        lundi.heure_debut = "10:00:00";
        lundi.heure_fin = "12:00:00";
        lundi.jour_semaine = "Lundi";
        lundi.point_livraison = pointLivraison;
                
        const mardi = new CreneauLivraisonEntity();
        mardi.annee = new Date().getFullYear()
        mardi.heure_debut = "10:00:00";
        mardi.heure_fin = "12:00:00";
        mardi.jour_semaine = "Mardi";
        mardi.point_livraison = pointLivraison;

        const mercredi = new CreneauLivraisonEntity();
        mercredi.annee = new Date().getFullYear()
        mercredi.heure_debut = "10:00:00";
        mercredi.heure_fin = "12:00:00";
        mercredi.jour_semaine = "Mercredi";
        mercredi.point_livraison = pointLivraison;
                    
        const Jeudi = new CreneauLivraisonEntity();
        Jeudi.annee = new Date().getFullYear()
        Jeudi.heure_debut = "10:00:00";
        Jeudi.heure_fin = "12:00:00";
        Jeudi.jour_semaine = "Jeudi";
        Jeudi.point_livraison = pointLivraison;

        const Vendredi = new CreneauLivraisonEntity();
        Vendredi.annee = new Date().getFullYear()
        Vendredi.heure_debut = "10:00:00";
        Vendredi.heure_fin = "12:00:00";
        Vendredi.jour_semaine = "Vendredi";
        Vendredi.point_livraison = pointLivraison;

        const Samedi = new CreneauLivraisonEntity();
        Samedi.annee = new Date().getFullYear()
        Samedi.heure_debut = "10:00:00";
        Samedi.heure_fin = "12:00:00";
        Samedi.jour_semaine = "Samedi";
        Samedi.point_livraison = pointLivraison;

        const dimanche = new CreneauLivraisonEntity();
        dimanche.annee = new Date().getFullYear()
        dimanche.heure_debut = "10:00:00";
        dimanche.heure_fin = "12:00:00";
        dimanche.jour_semaine = "Dimanche";
        dimanche.point_livraison = pointLivraison;

        return [lundi, mardi, mercredi, Jeudi, Vendredi, Samedi, dimanche];
    } 

    static getDefaultCreneauLivraison3(pointLivraison: PointLivraisonEntity): CreneauLivraisonEntity[] {
        const lundi = new CreneauLivraisonEntity();
        lundi.annee = new Date().getFullYear()
        lundi.heure_debut = "13:00:00";
        lundi.heure_fin = "15:30:00";
        lundi.jour_semaine = "Lundi";
        lundi.point_livraison = pointLivraison;
                
        const mardi = new CreneauLivraisonEntity();
        mardi.annee = new Date().getFullYear()
        mardi.heure_debut = "13:00:00";
        mardi.heure_fin = "15:30:00";
        mardi.jour_semaine = "Mardi";
        mardi.point_livraison = pointLivraison;

        const mercredi = new CreneauLivraisonEntity();
        mercredi.annee = new Date().getFullYear()
        mercredi.heure_debut = "13:00:00";
        mercredi.heure_fin = "15:30:00";
        mercredi.jour_semaine = "Mercredi";
        mercredi.point_livraison = pointLivraison;
                    
        const Jeudi = new CreneauLivraisonEntity();
        Jeudi.annee = new Date().getFullYear()
        Jeudi.heure_debut = "13:00:00";
        Jeudi.heure_fin = "15:30:00";
        Jeudi.jour_semaine = "Jeudi";
        Jeudi.point_livraison = pointLivraison;

        const Vendredi = new CreneauLivraisonEntity();
        Vendredi.annee = new Date().getFullYear()
        Vendredi.heure_debut = "13:00:00";
        Vendredi.heure_fin = "15:30:00";
        Vendredi.jour_semaine = "Vendredi";
        Vendredi.point_livraison = pointLivraison;

        const Samedi = new CreneauLivraisonEntity();
        Samedi.annee = new Date().getFullYear()
        Samedi.heure_debut = "13:00:00";
        Samedi.heure_fin = "15:30:00";
        Samedi.jour_semaine = "Samedi";
        Samedi.point_livraison = pointLivraison;

        const dimanche = new CreneauLivraisonEntity();
        dimanche.annee = new Date().getFullYear()
        dimanche.heure_debut = "13:00:00";
        dimanche.heure_fin = "15:30:00";
        dimanche.jour_semaine = "Dimanche";
        dimanche.point_livraison = pointLivraison;

        return [lundi, mardi, mercredi, Jeudi, Vendredi, Samedi, dimanche];
    } 

    static getDefaultCreneauLivraison4(pointLivraison: PointLivraisonEntity): CreneauLivraisonEntity[] {
        const lundi = new CreneauLivraisonEntity();
        lundi.annee = new Date().getFullYear()
        lundi.heure_debut = "16:00:00";
        lundi.heure_fin = "18:00:00";
        lundi.jour_semaine = "Lundi";
        lundi.point_livraison = pointLivraison;
                
        const mardi = new CreneauLivraisonEntity();
        mardi.annee = new Date().getFullYear()
        mardi.heure_debut = "16:00:00";
        mardi.heure_fin = "18:30:00";
        mardi.jour_semaine = "Mardi";
        mardi.point_livraison = pointLivraison;

        const mercredi = new CreneauLivraisonEntity();
        mercredi.annee = new Date().getFullYear()
        mercredi.heure_debut = "16:00:00";
        mercredi.heure_fin = "18:30:00";
        mercredi.jour_semaine = "Mercredi";
        mercredi.point_livraison = pointLivraison;
                    
        const Jeudi = new CreneauLivraisonEntity();
        Jeudi.annee = new Date().getFullYear()
        Jeudi.heure_debut = "16:00:00";
        Jeudi.heure_fin = "18:30:00";
        Jeudi.jour_semaine = "Jeudi";
        Jeudi.point_livraison = pointLivraison;

        const Vendredi = new CreneauLivraisonEntity();
        Vendredi.annee = new Date().getFullYear()
        Vendredi.heure_debut = "16:00:00";
        Vendredi.heure_fin = "18:30:00";
        Vendredi.jour_semaine = "Vendredi";
        Vendredi.point_livraison = pointLivraison;

        const Samedi = new CreneauLivraisonEntity();
        Samedi.annee = new Date().getFullYear()
        Samedi.heure_debut = "16:00:00";
        Samedi.heure_fin = "18:30:00";
        Samedi.jour_semaine = "Samedi";
        Samedi.point_livraison = pointLivraison;

        const dimanche = new CreneauLivraisonEntity();
        dimanche.annee = new Date().getFullYear()
        dimanche.heure_debut = "16:00:00";
        dimanche.heure_fin = "18:30:00";
        dimanche.jour_semaine = "Dimanche";
        dimanche.point_livraison = pointLivraison;

        return [lundi, mardi, mercredi, Jeudi, Vendredi, Samedi, dimanche];
    } 
}