CREATE TABLE roles(
   id_role VARCHAR(50) ,
   nom_role TEXT NOT NULL,
   PRIMARY KEY(id_role),
   UNIQUE(nom_role)
);

CREATE TABLE prestataire(
   id_prestataire SERIAL,
   nom_entreprise TEXT NOT NULL,
   NIF TEXT,
   STAT TEXT,
   adresse1 TEXT,
   adresse2 TEXT,
   departement TEXT NOT NULL,
   etat TEXT,
   ville TEXT NOT NULL,
   pays TEXT NOT NULL,
   code_postal VARCHAR(50)  NOT NULL,
   telephone VARCHAR(16)  NOT NULL,
   email TEXT NOT NULL,
   est_active BOOLEAN NOT NULL DEFAULT TRUE,
   PRIMARY KEY(id_prestataire),
   UNIQUE(nom_entreprise),
   UNIQUE(NIF),
   UNIQUE(STAT),
   UNIQUE(telephone),
   UNIQUE(email)
);

CREATE TABLE points_livraisons(
   id_point_livraison SERIAL,
   numero_magasin TEXT NOT NULL,
   nom_rue TEXT,
   numero_rue VARCHAR(50) ,
   departement TEXT,
   ville TEXT NOT NULL,
   pays TEXT,
   latitude DOUBLE PRECISION,
   longitude DOUBLE PRECISION,
   code_postal TEXT NOT NULL,
   complement_adresse TEXT,
   id_prestataire INTEGER,
   PRIMARY KEY(id_point_livraison),
   FOREIGN KEY(id_prestataire) REFERENCES prestataire(id_prestataire)
);

CREATE TABLE plannings_livraisons(
   id_planning_livraison SERIAL,
   date_debut DATE NOT NULL,
   date_fin DATE NOT NULL,
   heure_debut TIME NOT NULL,
   heure_fin TIME NOT NULL,
   nombre_livraison INTEGER NOT NULL,
   priorite_livraison TEXT NOT NULL,
   statut_planning TEXT NOT NULL,
   remarque TEXT,
   exceptions TEXT,
   PRIMARY KEY(id_planning_livraison)
);

CREATE TABLE contraintes_livraisons(
   id_contrainte_livraison SERIAL,
   intitule_contrainte TEXT NOT NULL,
   date_debut DATE,
   date_fin DATE,
   priorite_contrainte TEXT,
   id_point_livraison INTEGER NOT NULL,
   PRIMARY KEY(id_contrainte_livraison),
   FOREIGN KEY(id_point_livraison) REFERENCES points_livraisons(id_point_livraison)
);

CREATE TABLE types_utilisateurs(
   id_type_utilisateur VARCHAR(50) ,
   type TEXT NOT NULL,
   PRIMARY KEY(id_type_utilisateur),
   UNIQUE(type)
);

CREATE TABLE categories_livreurs(
   id_categorie_livreur TEXT,
   categorie_livreur TEXT NOT NULL,
   PRIMARY KEY(id_categorie_livreur),
   UNIQUE(categorie_livreur)
);

CREATE TABLE contraintes_jours(
   id_contrainte_jour SERIAL,
   jour TEXT NOT NULL,
   est_livrable BOOLEAN NOT NULL,
   heure_debut TIME,
   heure_fin TIME,
   id_contrainte_livraison INTEGER NOT NULL,
   PRIMARY KEY(id_contrainte_jour),
   FOREIGN KEY(id_contrainte_livraison) REFERENCES contraintes_livraisons(id_contrainte_livraison)
);

CREATE TABLE problemes_livraisons(
   id_probleme_livraison SERIAL,
   description TEXT NOT NULL,
   PRIMARY KEY(id_probleme_livraison),
   UNIQUE(description)
);

CREATE TABLE destinataires(
   id_destinataire SERIAL,
   nom TEXT NOT NULL,
   adresse TEXT NOT NULL,
   numero_telephone TEXT,
   adresse_mail TEXT,
   PRIMARY KEY(id_destinataire)
);

CREATE TABLE evenements_locaux(
   id_evenement SERIAL,
   nom_evenement TEXT NOT NULL,
   jour_semaine TEXT,
   date_debut DATE,
   date_fin DATE,
   type TEXT NOT NULL,
   frequence TEXT NOT NULL,
   PRIMARY KEY(id_evenement)
);

CREATE TABLE contraintes_evenement(
   id_contrainte_evenement SERIAL,
   id_point_livraison INTEGER NOT NULL,
   id_evenement INTEGER NOT NULL,
   PRIMARY KEY(id_contrainte_evenement),
   FOREIGN KEY(id_point_livraison) REFERENCES points_livraisons(id_point_livraison),
   FOREIGN KEY(id_evenement) REFERENCES evenements_locaux(id_evenement)
);

CREATE TABLE creneaux_livraison(
   id_creneau_horaire SERIAL,
   jour_semaine TEXT NOT NULL,
   heure_debut TIME NOT NULL,
   heure_fin TIME NOT NULL,
   annee INTEGER NOT NULL,
   id_point_livraison INTEGER NOT NULL,
   PRIMARY KEY(id_creneau_horaire),
   FOREIGN KEY(id_point_livraison) REFERENCES points_livraisons(id_point_livraison)
);

CREATE TABLE utilisateurs(
   id_utilisateur SERIAL,
   nom TEXT NOT NULL,
   prenom TEXT NOT NULL,
   civilite TEXT NOT NULL,
   date_naissance DATE NOT NULL,
   telephone VARCHAR(16)  NOT NULL,
   email TEXT NOT NULL,
   login TEXT NOT NULL,
   mot_de_passe TEXT NOT NULL,
   est_active BOOLEAN NOT NULL DEFAULT TRUE,
   photo_profil TEXT,
   id_prestataire INTEGER,
   id_role VARCHAR(50)  NOT NULL,
   id_type_utilisateur VARCHAR(50)  NOT NULL,
   PRIMARY KEY(id_utilisateur),
   UNIQUE(telephone),
   UNIQUE(email),
   UNIQUE(login),
   UNIQUE(mot_de_passe),
   UNIQUE(photo_profil),
   FOREIGN KEY(id_prestataire) REFERENCES prestataire(id_prestataire),
   FOREIGN KEY(id_role) REFERENCES roles(id_role),
   FOREIGN KEY(id_type_utilisateur) REFERENCES types_utilisateurs(id_type_utilisateur)
);

CREATE TABLE notifications(
   id_notification SERIAL,
   titre TEXT NOT NULL,
   dateheure_notification TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
   message TEXT NOT NULL,
   id_utilisateur INTEGER NOT NULL,
   id_utilisateur_1 INTEGER NOT NULL,
   PRIMARY KEY(id_notification),
   FOREIGN KEY(id_utilisateur) REFERENCES utilisateurs(id_utilisateur),
   FOREIGN KEY(id_utilisateur_1) REFERENCES utilisateurs(id_utilisateur)
);

CREATE TABLE itineraires_livraisons(
   id_itineraire_livraison SERIAL,
   rang INTEGER NOT NULL,
   date_tournee DATE NOT NULL,
   statut TEXT NOT NULL,
   heure_debut TIME NOT NULL DEFAULT CURRENT_TIME,
   heure_fin TIME NOT NULL DEFAULT CURRENT_TIME,
   id_utilisateur INTEGER NOT NULL,
   id_point_livraison INTEGER NOT NULL,
   id_planning_livraison INTEGER NOT NULL,
   PRIMARY KEY(id_itineraire_livraison),
   FOREIGN KEY(id_utilisateur) REFERENCES utilisateurs(id_utilisateur),
   FOREIGN KEY(id_point_livraison) REFERENCES points_livraisons(id_point_livraison),
   FOREIGN KEY(id_planning_livraison) REFERENCES plannings_livraisons(id_planning_livraison)
);

CREATE TABLE detail_info_livreur(
   id_livreur SERIAL,
   total_points DOUBLE PRECISION NOT NULL DEFAULT 0,
   rang_global INTEGER NOT NULL DEFAULT 0,
   peut_faire_chargement_colis BOOLEAN NOT NULL DEFAULT TRUE,
   qr_code TEXT,
   total_livraison_effectue INTEGER NOT NULL DEFAULT 0,
   id_categorie_livreur TEXT NOT NULL,
   id_utilisateur INTEGER NOT NULL,
   PRIMARY KEY(id_livreur),
   UNIQUE(id_utilisateur),
   FOREIGN KEY(id_categorie_livreur) REFERENCES categories_livreurs(id_categorie_livreur),
   FOREIGN KEY(id_utilisateur) REFERENCES utilisateurs(id_utilisateur)
);

CREATE TABLE livraisons(
   id_livraison SERIAL,
   date_livraison DATE NOT NULL,
   heure_debut TIME,
   heure_fin TIME,
   adresse_livraison TEXT NOT NULL,
   status TEXT NOT NULL,
   notes TEXT,
   feedback TEXT,
   estimation_retard TIMESTAMP,
   point_obtenu DOUBLE PRECISION NOT NULL DEFAULT 0,
   livree_le TIMESTAMP,
   preuve_livraison TEXT,
   id_itineraire_livraison INTEGER NOT NULL,
   PRIMARY KEY(id_livraison),
   FOREIGN KEY(id_itineraire_livraison) REFERENCES itineraires_livraisons(id_itineraire_livraison)
);

CREATE TABLE positions_gps_livreur(
   id_position_gps_livreur SERIAL,
   coordonnee_depart DOUBLE PRECISION NOT NULL,
   coordonnee_final DOUBLE PRECISION NOT NULL,
   id_livreur INTEGER NOT NULL,
   PRIMARY KEY(id_position_gps_livreur),
   FOREIGN KEY(id_livreur) REFERENCES detail_info_livreur(id_livreur)
);

CREATE TABLE colis(
   id_colis SERIAL,
   code_barres TEXT NOT NULL,
   codes_barres_client TEXT NOT NULL,
   poids DOUBLE PRECISION NOT NULL DEFAULT 0,
   contenu TEXT,
   valeur_declaree NUMERIC(15,2)  ,
   status TEXT NOT NULL,
   adresse_expedition TEXT NOT NULL,
   adresse_livraison TEXT NOT NULL,
   date_expedition DATE NOT NULL,
   date_livraison TIMESTAMP,
   nom_destinataire TEXT NOT NULL,
   numero_telephone VARCHAR(16) ,
   adresse_email TEXT NOT NULL,
   id_destinataire INTEGER NOT NULL,
   id_livraison INTEGER,
   PRIMARY KEY(id_colis),
   UNIQUE(code_barres),
   FOREIGN KEY(id_destinataire) REFERENCES destinataires(id_destinataire),
   FOREIGN KEY(id_livraison) REFERENCES livraisons(id_livraison)
);

CREATE TABLE bordereau_livraison(
   id_bordereau_livraison SERIAL,
   date_livraison DATE NOT NULL DEFAULT CURRENT_DATE,
   heure_livraison TIME NOT NULL DEFAULT CURRENT_TIME,
   rue_destinataire VARCHAR(50) ,
   code_postal_destinataire TEXT NOT NULL,
   ville_destinataire TEXT NOT NULL,
   pays_destinataire TEXT NOT NULL,
   id_livraison INTEGER NOT NULL,
   PRIMARY KEY(id_bordereau_livraison),
   UNIQUE(id_livraison),
   FOREIGN KEY(id_livraison) REFERENCES livraisons(id_livraison)
);

CREATE TABLE incident_livraison(
   id_livraison INTEGER,
   id_probleme_livraison INTEGER,
   date_incident TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
   PRIMARY KEY(id_livraison, id_probleme_livraison),
   FOREIGN KEY(id_livraison) REFERENCES livraisons(id_livraison),
   FOREIGN KEY(id_probleme_livraison) REFERENCES problemes_livraisons(id_probleme_livraison)
);
