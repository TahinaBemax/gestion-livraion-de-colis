import { DetailColisDto } from "src/common/dto/colis/detail-colis-dto";
import { LivraisonCreateDto } from "src/common/dto/livraison/create-livraison-dto";

export class LivraisonDataTest {
    static getListLivraisonPointLivraion1(idClient: number): LivraisonCreateDto[]{
        // POINT DE LIVRAISON 1
        // ++++++ PREMIERE LIVRAISON ++++++
        const livraison1 = new LivraisonCreateDto();
        livraison1.date_livraison = "2025-10-02";
        livraison1.heure_debut = "10:20:00";
        livraison1.heure_fin = "14:00:00";
        livraison1.id_client = idClient;
        
        const livraison1Produit1 = new DetailColisDto();
        livraison1Produit1.description_produit = " Montre connectée";
        livraison1Produit1.poids_produit = 0.5;
        livraison1Produit1.valeur_produit = 150000;
        
        const livraison1Produit2 = new DetailColisDto();
        livraison1Produit2.description_produit = " Ecouteurs sans fil";
        livraison1Produit2.poids_produit = 0.1;
        livraison1Produit2.valeur_produit = 10000;

        livraison1.colis = [livraison1Produit1, livraison1Produit2];

        // ++++++ DEUXIME LIVRAISON ++++++
        const livraison2 = new LivraisonCreateDto();
        livraison2.date_livraison = "2025-10-02";
        livraison2.heure_debut = "09:00:00";
        livraison2.heure_fin = "10:00:00";
        livraison2.id_client = idClient;

        const livraison2Produit1 = new DetailColisDto();
        livraison2Produit1.description_produit = "Telephone";
        livraison2Produit1.poids_produit = 0.8;
        livraison2Produit1.valeur_produit = 2500000;

        livraison2.colis = [livraison2Produit1];

        return [livraison1, livraison2];
    }

    static getListLivraisonPointLivraion2(idClient: number): LivraisonCreateDto[]{
        // POINT DE LIVRAISON 2
        // ++++++ PREMIERE LIVRAISON ++++++
        const livraison1 = new LivraisonCreateDto();
        livraison1.date_livraison = "2025-10-02";
        livraison1.heure_debut = "08:20:00";
        livraison1.heure_fin = "10:00:00";
        livraison1.id_client = idClient;
        
        const livraison1Produit1 = new DetailColisDto();
        livraison1Produit1.description_produit = "Ordinateur portable";
        livraison1Produit1.poids_produit = 2.5;
        livraison1Produit1.valeur_produit = 2000000;
        
        const livraison1Produit2 = new DetailColisDto();
        livraison1Produit2.description_produit = "Souris sans fil";
        livraison1Produit2.poids_produit = 0.1;
        livraison1Produit2.valeur_produit = 19000;

        const livraison1Produit3 = new DetailColisDto();
        livraison1Produit3.description_produit = "USB 3.0";
        livraison1Produit3.poids_produit = 0.05;
        livraison1Produit3.valeur_produit = 40000;
        
        livraison1.colis = [livraison1Produit1, livraison1Produit2, livraison1Produit3];
        return [livraison1];
    }
}