-- Create a sequence for generating REF-00001, REF-00002, etc.
CREATE SEQUENCE IF NOT EXISTS ref_bordereau 
    START 1
    INCREMENT 1
    MINVALUE 1;

/* DEFAULT DATA*/

/* +++ ROLES +++ */
INSERT INTO 
    roles(id_role, nom_role)
VALUES
('ROLE-01', 'Admin'),
('ROLE-02', 'Utilisateur'),
('ROLE-03', 'Responsable Exploitation');
/* -- --- --- */


/* +++ TYPES UTILISATEURS +++ */
INSERT INTO 
    types_utilisateur(id_type_utilisateur, type)
VALUES
('TYPE-USER-00001', 'Tempo One'),
('TYPE-USER-00002', 'Prestataire'),
('TYPE-USER-00003', 'Livreur');
/* -- --- --- */


/* +++ CATEGORIES LIVREURS +++ */
INSERT INTO 
    categories_livreur(id_categorie_livreur, categorie_livreur)
VALUES
('CAT-LIVREUR-00001', 'Novice'),
('CAT-LIVREUR-00002', 'Ponctuel'),
('CAT-LIVREUR-00003', 'Regulier');


/* La date de scan du premier colis au chargement pour tous les tournées*/

CREATE OR REPLACE VIEW 
    premier_colis_au_chargement
AS
SELECT
    ol.id_tournee,
    c.id_colis,
    c.date_heure_chargement 
FROM 
    ordres_livraison ol
JOIN 
    livraisons l
ON 
    l.id_livraison = ol.id_livraison
JOIN 
    colis c
ON 
    c.id_livraison = l.id_livraison
ORDER BY
    c.date_heure_chargement DESC; 

/* La date de scan du dernier colis à la livraison */

CREATE OR REPLACE VIEW 
    dernier_colis_au_dechargement
AS
SELECT
    ol.id_tournee,
    c.id_colis,
    c.date_heure_dechargement 
FROM 
    ordres_livraison ol
JOIN 
    livraisons l
ON 
    l.id_livraison = ol.id_livraison
JOIN 
    colis c
ON 
    c.id_livraison = l.id_livraison
ORDER BY
    c.date_heure_dechargement DESC;
/* -- --- --- */
