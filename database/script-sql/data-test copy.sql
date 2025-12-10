/* =======================
   LIVRAISONS
   ======================= */
INSERT INTO livraisons (
  id_livraison, nom_destinataire, adresse_principale, complement_adresse,
  ville, pays, code_postal, date_livraison, heure_debut, heure_fin,
  notes, statut_livraison, id_client
) VALUES
(20, 'Rasoanaivo Miora', '12 Avenue, pavillon, Antananarivo', null, 'Antananarivo','Madagascar', '101', '2025-11-10', '08:00', '08:30', null, 'Livraison partielle', 1),
(21, 'Rakoto Jean', '12 Avenue, pavillon, Antananarivo', null, 'Antananarivo','Madagascar', '101', '2025-11-10', '08:20', '08:50', null, 'Livré', 2);

/* =======================
   COLIS
   ======================= */
INSERT INTO colis (
  id_colis, code_barre_client_colis, poids_total, statut_colis,
  date_heure_chargement, date_heure_dechargement, date_heure_accuse_reception,
  date_heure_retour_expediteur, id_livraison
) VALUES
(20, 'REF-CLIENT-000020', 2.5, 'Livré', '2025-11-10 07:45:00', '2025-11-10 08:03:00', '2025-11-10 08:05:00', NULL, 20),
(21, 'REF-CLIENT-000021', 4.2, 'Livré', '2025-11-10 07:50:00', '2025-11-10 08:15:00', '2025-11-10 08:20:00', NULL, 21),
(22, 'REF-CLIENT-000023', 4.2, 'Retour à l''expediteur', null, NULL, NULL , '2025-11-10 07:49:00', 20);

/* =======================
   PRODUITS
   ======================= */
INSERT INTO produits (ref_produit, description_produit, poids_produit, valeur_produit, id_colis)
VALUES
(20, 'Smartphone Samsung Galaxy S24', 0.5, 1200.00, 20),
(22, 'Google pixel', 0.5, 1200.00, 20),
(21, 'Coffret cadeau – Chocolats artisanaux', 1.2, 80.00, 20);

INSERT INTO problemes_colis 
   (id_probleme_colis, titre, description, date_heure_probleme_colis, id_colis)
VALUES
   (20, 'Code barre illisible', '', '2025-11-10 07:48:40', 22);
   

/* =======================
   TOURNEES LIVRAISON
   ======================= */
INSERT INTO tournees_livraison (
  id_tournee, date_tournee, heure_debut, heure_fin, statut, id_prestataire, id_livreur
) VALUES
(20, '2025-11-10', '08:00', '18:00', 'Terminé', 1, 2);
INSERT INTO tournees_livraison (
  id_tournee, date_tournee, heure_debut, heure_fin, statut, id_prestataire, id_livreur
) VALUES
(21, '2025-11-04', '08:00', '18:00', 'Terminé', 1, 2);
INSERT INTO tournees_livraison (
  id_tournee, date_tournee, heure_debut, heure_fin, statut, id_prestataire, id_livreur
) VALUES
(22, '2025-11-07', '08:00', '18:00', 'Terminé', 1, 2);
INSERT INTO tournees_livraison (
  id_tournee, date_tournee, heure_debut, heure_fin, statut, id_prestataire, id_livreur
) VALUES
(23, '2025-10-30', '08:00', '18:00', 'Terminé', 1, 2);
INSERT INTO tournees_livraison (
  id_tournee, date_tournee, heure_debut, heure_fin, statut, id_prestataire, id_livreur
) VALUES
(24, '2025-10-31', '08:00', '18:00', 'Terminé', 1, 2);


/* =======================
   ORDRES LIVRAISON
   ======================= */
INSERT INTO ordres_livraison (
  id_ordre_livraison, point_obtenu, estimation_retard, nbr_colis_prevu,
  nbr_colis_reel, statut, id_point_livraison, id_tournee, id_livraison
) VALUES
(20, 3, null, 1, 1, 'Effectué', 1, 20, 20),
(21, 3, NULL, 1, 1, 'Effectué', 1, 20, 21);


/* =======================
   BORDEREAUX LIVRAISON
   ======================= */
INSERT INTO bordereaux_livraison (
  ref_bordereau_livraison, nom_expediteur, adresse_expediteur, contact_expediteur,
  nom_destinataire, adresse_destinataire, contact_destinataire, date_bordereau,
  date_livraison, id_ordre_livraison
) VALUES
('BL-00000020', 'AdriColis', 'Isoavimasoandro', '+261340000000',
 'Rasoanaivo Miora', '12 Avenue, pavillon, Antananarivo ', '+33677889900',
 '2025-11-10', '2025-11-10', 20),
('BL-00000021', 'AdriColis', 'Isoavimasoandro', '+261340000000',
 'Rakoto Jean', '12 Avenue, pavillon, Antananarivo ', '+261328899011',
 '2025-11-10', '2025-11-10', 20);


 /* FROM CHATGPT */
 /* =======================
   LIVRAISONS
   ======================= */
INSERT INTO livraisons (
  id_livraison, nom_destinataire, adresse_principale, complement_adresse,
  ville, pays, code_postal, date_livraison, heure_debut, heure_fin,
  notes, statut_livraison, id_client
) VALUES
(101, 'Rasoanaivo Miora', '12 Avenue, Pavillon, Antananarivo', NULL, 'Antananarivo', 'Madagascar', '101', '2025-11-07', '08:00', '08:20', NULL, 'Livré', 1),
(102, 'Rakoto Jean', 'Ambanidia, Lot IVC, Antananarivo', NULL, 'Antananarivo', 'Madagascar', '101', '2025-10-30', '09:00', '09:25', NULL, 'Livré', 2),

-- Prestataire 2
(103, 'Andriana Mamy', 'Résidence Finaritra, Toamasina', NULL, 'Toamasina', 'Madagascar', '501', '2025-10-31', '08:30', '09:00', NULL, 'Livré', 3),
(104, 'Ravelo Tahina', 'Cité Canada, Toamasina', NULL, 'Toamasina', 'Madagascar', '501', '2025-11-01', '09:30', '10:00', NULL, 'Livré', 4),

-- Prestataire 3
(105, 'Rasoa Lova', 'Amboropotsy, Fianarantsoa', NULL, 'Fianarantsoa', 'Madagascar', '301', '2025-11-07', '08:00', '08:15', NULL, 'Livré', 5),
(106, 'Randria Nomena', 'Ampasambazaha, Fianarantsoa', NULL, 'Fianarantsoa', 'Madagascar', '301', '2025-10-30', '10:00', '10:25', NULL, 'Livré', 6);


/* =======================
   COLIS
   ======================= */
INSERT INTO colis (
  id_colis, code_barre_client_colis, poids_total, statut_colis,
  date_heure_chargement, date_heure_dechargement, date_heure_accuse_reception,
  date_heure_retour_expediteur, id_livraison
) VALUES
(201, 'REF-CLIENT-000101', 2.5, 'Livré', '2025-11-07 07:45:00', '2025-11-07 08:05:00', '2025-11-07 08:06:00', NULL, 101),
(202, 'REF-CLIENT-000102', 3.1, 'Livré', '2025-10-30 08:45:00', '2025-10-30 09:10:00', '2025-10-30 09:12:00', NULL, 102),
(203, 'REF-CLIENT-000103', 4.0, 'Livré', '2025-10-31 08:10:00', '2025-10-31 08:40:00', '2025-10-31 08:42:00', NULL, 103),
(204, 'REF-CLIENT-000104', 1.8, 'Livré', '2025-11-01 09:00:00', '2025-11-01 09:25:00', '2025-11-01 09:30:00', NULL, 104),
(205, 'REF-CLIENT-000105', 2.2, 'Livré', '2025-11-07 07:50:00', '2025-11-07 08:10:00', '2025-11-07 08:11:00', NULL, 105),
(206, 'REF-CLIENT-000106', 3.4, 'Livré', '2025-10-30 09:40:00', '2025-10-30 10:05:00', '2025-10-30 10:06:00', null, 106);


/* =======================
   PRODUITS
   ======================= */
INSERT INTO produits (ref_produit, description_produit, poids_produit, valeur_produit, id_colis) VALUES
(301, 'Ordinateur portable HP ProBook 450', 2.2, 1800.00, 201),
(302, 'Montre connectée Samsung Watch 6', 0.3, 300.00, 202),
(303, 'Vêtement – Pull en laine', 0.7, 40.00, 203),
(304, 'Livre – L’art de la guerre', 0.4, 15.00, 204),
(305, 'Smartphone Xiaomi 14', 0.6, 900.00, 205),
(306, 'Vase décoratif en verre', 1.5, 50.00, 206);


/* =======================
   PROBLEMES COLIS
   ======================= */
INSERT INTO problemes_colis (
  id_probleme_colis, titre, description, date_heure_probleme_colis, id_colis
) VALUES
(401, 'Code barre illisible', '', '2025-10-30 09:45:00', 206),
(402, 'Colis abîmé', 'Coin gauche légèrement enfoncé', '2025-10-31 08:25:00', 203);


/* =======================
   TOURNEES LIVRAISON
   ======================= */
INSERT INTO tournees_livraison (
  id_tournee, date_tournee, heure_debut, heure_fin, statut, id_prestataire, id_livreur
) VALUES
(501, '2025-11-07', '07:30', '17:00', 'Terminé', 1, 1),
(502, '2025-10-30', '07:30', '17:30', 'Terminé', 1, 2),
(503, '2025-10-31', '08:00', '18:00', 'Terminé', 2, 2),
(504, '2025-11-01', '08:00', '18:00', 'Terminé', 2, 3),
(505, '2025-11-07', '08:00', '18:00', 'Terminé', 3, 3),
(506, '2025-10-30', '08:00', '18:00', 'Terminé', 3, 1);


/* =======================
   ORDRES LIVRAISON
   ======================= */
INSERT INTO ordres_livraison (
  id_ordre_livraison, point_obtenu, estimation_retard, nbr_colis_prevu,
  nbr_colis_reel, statut, id_point_livraison, id_tournee, id_livraison
) VALUES
(601, 3, NULL, 1, 1, 'Effectué', 1, 501, 101),
(602, 3, NULL, 1, 1, 'Effectué', 2, 502, 102),
(603, 2, NULL, 1, 1, 'Effectué', 3, 503, 103),
(604, 3, NULL, 1, 1, 'Effectué', 1, 504, 104),
(605, 3, NULL, 1, 1, 'Effectué', 2, 505, 105),
(606, 1, NULL, 1, 1, 'Effectué', 3, 506, 106);


/* =======================
   BORDEREAUX LIVRAISON
   ======================= */
INSERT INTO bordereaux_livraison (
  ref_bordereau_livraison, nom_expediteur, adresse_expediteur, contact_expediteur,
  nom_destinataire, adresse_destinataire, contact_destinataire, date_bordereau,
  date_livraison, id_ordre_livraison
) VALUES
('BL-000601', 'AdriColis', 'Isoavimasoandro', '+261340000000',
 'Rasoanaivo Miora', '12 Avenue, Pavillon, Antananarivo', '+261348800001',
 '2025-11-07', '2025-11-07', 601),

('BL-000602', 'AdriColis', 'Isoavimasoandro', '+261340000000',
 'Rakoto Jean', 'Ambanidia, Lot IVC, Antananarivo', '+261328899011',
 '2025-10-30', '2025-10-30', 602),

('BL-000603', 'AdriColis', 'Isoavimasoandro', '+261340000000',
 'Andriana Mamy', 'Résidence Finaritra, Toamasina', '+261320700222',
 '2025-10-31', '2025-10-31', 603),

('BL-000604', 'AdriColis', 'Isoavimasoandro', '+261340000000',
 'Ravelo Tahina', 'Cité Canada, Toamasina', '+261326789111',
 '2025-11-01', '2025-11-01', 604),

('BL-000605', 'AdriColis', 'Isoavimasoandro', '+261340000000',
 'Rasoa Lova', 'Amboropotsy, Fianarantsoa', '+261340900333',
 '2025-11-07', '2025-11-07', 605),

('BL-000606', 'AdriColis', 'Isoavimasoandro', '+261340000000',
 'Randria Nomena', 'Ampasambazaha, Fianarantsoa', '+261349998877',
 '2025-10-30', '2025-10-30', 606);
