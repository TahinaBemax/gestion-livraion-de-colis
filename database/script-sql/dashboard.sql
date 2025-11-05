-- Paramètres : définir la période (semaine, mois ou autre)
WITH periode AS (
    SELECT '2025-10-27'::date AS date_debut, '2025-11-02'::date AS date_fin
),

-- 1. Nombre de livraisons effectuées par livreur sur la période
livraisons_par_livreur AS (
    SELECT
        l.id_livreur,
        COUNT(o.id_ordre_livraison) AS NB
    FROM ordres_livraison o
    INNER JOIN tournees_livraison t ON t.id_tournee = o.id_tournee
    INNER JOIN livreur_information l ON l.id_livreur = t.id_livreur
    INNER JOIN livraisons li ON li.id_livraison = o.id_livraison
    WHERE o.statut = 'Effectué'
    GROUP BY l.id_livreur
),

-- 2. Nombre de livraisons effectuées dans les temps
livraisons_dans_les_temps AS (
    SELECT
        l.id_livreur,
        COUNT(o.id_ordre_livraison) AS NBOT
    FROM ordres_livraison o
    INNER JOIN tournees_livraison t ON t.id_tournee = o.id_tournee
    INNER JOIN livreur_information l ON l.id_livreur = t.id_livreur
    INNER JOIN bordereaux_livraison bl ON li.id_livraison = o.id_livraison
    INNER JOIN livraisons li ON li.id_livraison = o.id_livraison
    WHERE o.statut = 'Effectué'
      AND (li.heure_fin <= li.heure_fin OR li.heure_fin IS NOT NULL)  -- Livraison dans les temps
    GROUP BY l.id_livreur
),

-- 3. Calcul du total des livraisons sur la période pour tous les livreurs (NBs)
total_livraisons AS (
    SELECT SUM(NB) AS NBs FROM livraisons_par_livreur
)

-- 4. Calcul final du score et du classement
SELECT
    l.id_livreur,
    l.id_utilisateur,
    lp.NB,
    ldt.NBOT,
    ROUND((lp.NB::decimal / NULLIF(tl.NBs,0)), 2) AS Diff,  -- Difficulté relative
    ROUND((ldt.NBOT::decimal / NULLIF(lp.NB,0)), 2) AS Score, -- Score réussite
    ROUND(((lp.NB::decimal / NULLIF(tl.NBs,0)) * 0.3) + ((ldt.NBOT::decimal / NULLIF(lp.NB,0)) * 0.7), 2) AS Score_classement
FROM livreur_information l
LEFT JOIN livraisons_par_livreur lp ON lp.id_livreur = l.id_livreur
LEFT JOIN livraisons_dans_les_temps ldt ON ldt.id_livreur = l.id_livreur
CROSS JOIN total_livraisons tl
ORDER BY Score_classement DESC;
