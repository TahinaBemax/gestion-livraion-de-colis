
/* CONSTRAINTS */
ALTER TABLE 
   types_utilisateurs 
ADD CONSTRAINT 
   type_check
CHECK(type = 'Livreur' OR type = 'Prestataire' OR type = 'Personnel');


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

/* */