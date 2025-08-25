
/* CONSTRAINTS */
ALTER TABLE 
   types_utilisateurs 
ADD CONSTRAINT 
   type_check
CHECK(type = 'Livreur' OR type = 'Prestataire' OR type = 'Tempo One');


ALTER TABLE 
   roles 
ADD CONSTRAINT 
   roles_check 
CHECK(nom_role = 'Admin' OR nom_role = 'Utilisateur' OR nom_role ='Responsable Exploitation');


ALTER TABLE 
   categories_livreurs 
ADD CONSTRAINT 
   categorie_livreur_check
CHECK(categorie_livreur = 'Novice' OR categorie_livreur = 'Ponctuel' OR categorie_livreur = 'Regulier');


ALTER TABLE 
   points_livraisons 
ADD CONSTRAINT 
   coordonnee_geographique_unique
UNIQUE(latitude, longitude);

ALTER TABLE 
   contraintes_evenement 
ADD CONSTRAINT 
   evenement_point_livraison_unique
UNIQUE(id_point_livraison, id_evenement);

ALTER TABLE 
   contraintes_livraisons 
ADD CONSTRAINT 
   intitule_contrainte_unique
UNIQUE(intitule_contrainte, date_debut, date_fin, id_point_livraison);

/* */