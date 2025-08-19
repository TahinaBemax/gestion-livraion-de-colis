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

CREATE TABLE plannings_livraison(
   id_planning_livraison SERIAL,
   date_debut DATE NOT NULL,
   date_fin DATE NOT NULL,
   heure_debut TIME NOT NULL,
   heure_fin TIME NOT NULL,
   nombre_livraison INTEGER NOT NULL,
   priorite_livraison TEXT NOT NULL,
   statut_planning TEXT NOT NULL,
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

CREATE TABLE colis(
   id_colis SERIAL,
   nom_destinataire TEXT NOT NULL,
   qrcode TEXT,
   qrcode_client TEXT,
   poids_total DOUBLE PRECISION,
   status TEXT NOT NULL,
   PRIMARY KEY(id_colis),
   UNIQUE(qrcode),
   UNIQUE(qrcode_client)
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
   id_evenement INTEGER NOT NULL,
   id_point_livraison INTEGER NOT NULL,
   PRIMARY KEY(id_contrainte_evenement),
   FOREIGN KEY(id_evenement) REFERENCES evenements_locaux(id_evenement),
   FOREIGN KEY(id_point_livraison) REFERENCES points_livraisons(id_point_livraison)
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

CREATE TABLE detail_colis(
   id_detail_colis SERIAL,
   description TEXT,
   poids DOUBLE PRECISION NOT NULL DEFAULT 0,
   valeur_declaree NUMERIC(15,2)   NOT NULL,
   id_colis INTEGER NOT NULL,
   PRIMARY KEY(id_detail_colis),
   FOREIGN KEY(id_colis) REFERENCES colis(id_colis)
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

CREATE TABLE livraisons(
   id_livraison SERIAL,
   notes TEXT,
   date_livraison DATE NOT NULL,
   heure_debut TIME,
   heure_fin TIME,
   departement TEXT,
   ville TEXT NOT NULL,
   pays TEXT NOT NULL,
   status TEXT NOT NULL,
   id_point_livraison INTEGER NOT NULL,
   id_colis INTEGER NOT NULL,
   PRIMARY KEY(id_livraison),
   FOREIGN KEY(id_point_livraison) REFERENCES points_livraisons(id_point_livraison),
   FOREIGN KEY(id_colis) REFERENCES colis(id_colis)
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

CREATE TABLE bordereaux_livraison(
   id_bordereau_livraison SERIAL,
   code_barre TEXT NOT NULL,
   nom_entreprise TEXT NOT NULL,
   adresse_entreprise TEXT NOT NULL,
   contact_entreprise TEXT NOT NULL,
   nom_destinataire TEXT NOT NULL,
   adresse_destinataire TEXT NOT NULL,
   contact_destinataire TEXT NOT NULL,
   date_livraison DATE NOT NULL,
   date_signature_livreur TIMESTAMP NOT NULL DEFAULT TIMESTAMP,
   date_accuse_reception TIMESTAMP NOT NULL DEFAULT TIMESTAMP,
   remarque TEXT,
   id_colis INTEGER NOT NULL,
   id_livreur INTEGER NOT NULL,
   id_livraison INTEGER NOT NULL,
   PRIMARY KEY(id_bordereau_livraison),
   UNIQUE(id_livraison),
   UNIQUE(code_barre),
   FOREIGN KEY(id_colis) REFERENCES colis(id_colis),
   FOREIGN KEY(id_livreur) REFERENCES detail_info_livreur(id_livreur),
   FOREIGN KEY(id_livraison) REFERENCES livraisons(id_livraison)
);

CREATE TABLE livreurs_temporaire(
   id_livreur_temporaire SERIAL,
   nom TEXT NOT NULL,
   prenom TEXT NOT NULL,
   date_naissance DATE NOT NULL,
   telephone TEXT NOT NULL,
   mot_de_passe TEXT NOT NULL,
   est_active BOOLEAN NOT NULL,
   date_creation TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
   id_livreur INTEGER NOT NULL,
   PRIMARY KEY(id_livreur_temporaire),
   UNIQUE(telephone),
   UNIQUE(mot_de_passe),
   FOREIGN KEY(id_livreur) REFERENCES detail_info_livreur(id_livreur)
);

CREATE TABLE positions_gps_livreur(
   id_position_gps_livreur SERIAL,
   coordonnee_depart DOUBLE PRECISION NOT NULL,
   coordonnee_final DOUBLE PRECISION NOT NULL,
   id_livreur INTEGER NOT NULL,
   PRIMARY KEY(id_position_gps_livreur),
   FOREIGN KEY(id_livreur) REFERENCES detail_info_livreur(id_livreur)
);

CREATE TABLE tournees_livraison(
   id_tournee SERIAL,
   date_tournee DATE NOT NULL,
   heure_debut TIME NOT NULL DEFAULT CURRENT_TIME,
   heure_fin TIME NOT NULL DEFAULT CURRENT_TIME,
   nbr_colis INTEGER NOT NULL,
   statut TEXT NOT NULL,
   id_livreur INTEGER NOT NULL,
   id_planning_livraison INTEGER NOT NULL,
   PRIMARY KEY(id_tournee),
   FOREIGN KEY(id_livreur) REFERENCES detail_info_livreur(id_livreur),
   FOREIGN KEY(id_planning_livraison) REFERENCES plannings_livraison(id_planning_livraison)
);

CREATE TABLE ordres_livraison(
   id_ordre_livraison SERIAL,
   point_obtenu DOUBLE PRECISION NOT NULL DEFAULT 0,
   feedback TEXT,
   estimation_retard TIMESTAMP,
   id_point_livraison INTEGER NOT NULL,
   id_tournee INTEGER NOT NULL,
   PRIMARY KEY(id_ordre_livraison),
   FOREIGN KEY(id_point_livraison) REFERENCES points_livraisons(id_point_livraison),
   FOREIGN KEY(id_tournee) REFERENCES tournees_livraison(id_tournee)
);

CREATE TABLE incident_livraison(
   id_livraison INTEGER,
   id_probleme_livraison INTEGER,
   date_incident TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
   PRIMARY KEY(id_livraison, id_probleme_livraison),
   FOREIGN KEY(id_livraison) REFERENCES livraisons(id_livraison),
   FOREIGN KEY(id_probleme_livraison) REFERENCES problemes_livraisons(id_probleme_livraison)
);

CREATE TABLE ordres_livraison_colis(
   id_colis INTEGER,
   id_ordre_livraison INTEGER,
   PRIMARY KEY(id_colis, id_ordre_livraison),
   FOREIGN KEY(id_colis) REFERENCES colis(id_colis),
   FOREIGN KEY(id_ordre_livraison) REFERENCES ordres_livraison(id_ordre_livraison)
);
