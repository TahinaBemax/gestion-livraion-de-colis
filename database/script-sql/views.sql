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
    details_ordre_livraison dol
ON 
    dol.id_ordre_livraison = ol.id_ordre_livraison
JOIN 
    livraisons l
ON 
    l.id_livraison = dol.id_livraison
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
    details_ordre_livraison dol
ON 
    dol.id_ordre_livraison = ol.id_ordre_livraison
JOIN 
    livraisons l
ON 
    l.id_livraison = dol.id_livraison
JOIN 
    colis c
ON 
    c.id_livraison = l.id_livraison
ORDER BY
    c.date_heure_dechargement DESC;