/* DEFAULT DATA*/

/* +++ ROLES +++ */
INSERT INTO 
    roles(id_role, nom_role)
VALUES
('ROLE-01', 'Admin'),
('ROLE-03', 'Responsable Exploitation'),
('ROLE-02', 'Utilisateur');
/* -- --- --- */


/* +++ TYPES UTILISATEURS +++ */
INSERT INTO 
    types_utilisateurs(id_type_utilisateur, type)
VALUES
('TYPE-USER-00001', 'Personnel'),
('TYPE-USER-00002', 'Prestataire'),
('TYPE-USER-00003', 'Livreur');
/* -- --- --- */


/* +++ CATEGORIES LIVREURS +++ */
INSERT INTO 
    categories_livreurs(id_categorie_livreur, categorie_livreur)
VALUES
('CAT-LIVREUR-00001', 'Novice'),
('CAT-LIVREUR-00002', 'Ponctuel'),
('CAT-LIVREUR-00003', 'Regulier');