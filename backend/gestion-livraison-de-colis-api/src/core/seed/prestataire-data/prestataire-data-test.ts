import { CreateUserDto } from "src/common/dto/create-user-dto";
import { CreateLivreurDto } from "src/common/dto/livreur/create-livreur-dto";
import { PrestataireCreateDto } from "src/common/dto/prestataire/create-prestataire-dto";
import { DefaulPrestataireAdminUserDto } from "src/common/dto/prestataire/default-user-prestataire-dto";
import { CategorieLivreurEnum } from "src/common/enum/categorie-livreur.enum";
import { UserRole } from "src/common/enum/user-role.enum";

export class PrestataireDataTest { 
    static getPrestataireUtilisateur(): CreateUserDto[]{
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

    static getListPrestataire(): PrestataireCreateDto[] {
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

    static getLivreurs(): CreateLivreurDto[] {
        const livreurNovice: CreateLivreurDto = new CreateLivreurDto();
        const novice_info: CreateUserDto = new CreateUserDto();

        livreurNovice.id_categorie_livreur = CategorieLivreurEnum.Novice;
        novice_info.nom = "Geneviève";
        novice_info.prenom = "Novice";
        novice_info.email = "livreur.novice@gmail.com";
        novice_info.mot_de_passe = "livreurNovice123!";
        livreurNovice.user = novice_info;

        const livreurPoncuel: CreateLivreurDto = new CreateLivreurDto();
        const ponctuel: CreateUserDto = new CreateUserDto();

        livreurPoncuel.id_categorie_livreur = CategorieLivreurEnum.Ponctuel;
        ponctuel.nom = "Jean";
        ponctuel.prenom = "Jacques";
        ponctuel.email = "livreur.ponctuel@gmail.com";
        ponctuel.mot_de_passe = "livreurPoctuel123!";
        livreurPoncuel.user = ponctuel;

        const livreurRegulier: CreateLivreurDto = new CreateLivreurDto();
        const regulier: CreateUserDto = new CreateUserDto();

        livreurRegulier.id_categorie_livreur = CategorieLivreurEnum.Regulier;
        regulier.nom = "Jean";
        regulier.prenom = "Bertin";
        regulier.email = "livreur.regulier@gmail.com";
        regulier.mot_de_passe = "livreurRegulier123!";
        livreurRegulier.user = regulier;
        
        return [livreurNovice, livreurPoncuel, livreurRegulier];
    }
}
