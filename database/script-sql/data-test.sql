/* =======================
   PRESTATAIRES
   ======================= */
INSERT INTO prestataires (
  id_prestataire, nom_entreprise, NIF, STAT, adresse_principale,
  adresse_complementaire, departement, etat, ville, pays,
  code_postal, numero_telephone, adresse_email, nom_image_logo, est_active
) VALUES
(20, 'Quick Service', 'NIF00120', 'STAT00120', '5 Avenue des Champs', NULL, '75', 'Ile-de-France', 'Paris', 'France', '75008', '+33144556677', 'contact@quickservice.fr', 'quickservice_logo.png', TRUE),
(21, 'Madagascar Express', 'NIF00121', 'STAT00121', 'Rue Antanimena', NULL, 'Antananarivo', 'Analamanga', 'Antananarivo', 'Madagascar', '101', '+261340000777', 'info@madaexpress.mg', 'madaexpress_logo.png', TRUE);

/* =======================
   POINTS DE LIVRAISON
   ======================= */
INSERT INTO points_livraison (
  id_point_livraison, nom_point_livraison, nom_rue, numero_rue,
  departement, ville, pays, latitude, longitude, code_postal,
  complement_adresse, id_prestataire
) VALUES
(20, 'PL Champs Élysées', 'Avenue des Champs', '5', '75', 'Paris', 'France', 48.8708, 2.3073, '75008', 'Près de l''Arc de Triomphe', 1),
(21, 'PL Antanimena', 'Boulevard de l''Europe', '12', NULL, 'Antananarivo', 'Madagascar', -18.894, 47.519, '101', NULL, 1);

/* =======================
   UTILISATEURS
   ======================= */
-- INSERT INTO utilisateurs (
--   id_utilisateur, nom, prenom, civilite, date_naissance, numero_telephone,
--   adresse_email, mot_de_passe, est_active, photo_profil, id_prestataire,
--   id_role, id_type_utilisateur
-- ) VALUES
-- (20, 'Rakoto', 'Jean', 'M', '1990-03-14', '+261340001100', 'admin@quickservice.fr', 'hashed_admin_pwd', TRUE, 'rakoto.jpg', 20, 'ROLE-01', 'TYPE-USER-00002'),
-- (21, 'Andry', 'Fanilo', 'M', '1995-07-21', '+261340001101', 'livreur1@quickservice.fr', 'hashed_livreur1_pwd', TRUE, 'andry.jpg', 20, 'ROLE-02', 'TYPE-USER-00003'),
-- (22, 'Sarah', 'Rabe', 'F', '1994-09-10', '+261340001102', 'livreur2@madaexpress.mg', 'hashed_livreur2_pwd', TRUE, 'sarah.jpg', 21, 'ROLE-02', 'TYPE-USER-00003');

/* =======================
   LIVREURS INFORMATION
   ======================= */
-- INSERT INTO livreur_information (
--   id_livreur, peut_faire_chargement_colis, id_categorie_livreur, id_utilisateur
-- ) VALUES
-- (20, TRUE, 'CAT-LIVREUR-00002', 21),
-- (21, TRUE, 'CAT-LIVREUR-00003', 22);

/* =======================
   CLIENTS
   ======================= */
INSERT INTO clients (
  id_client, nom_client, prenom_client, civilite, numero_telephone, adresse_mail, id_point_livraison
) VALUES
(20, 'Dupont', 'Marie', 'F', '+33677889900', 'marie.dupont@gmail.com', 20),
(21, 'Randria', 'Tiana', 'M', '+261340889900', 'tiana.randria@mail.mg', 21);

/* =======================
   LIVRAISONS
   ======================= */
INSERT INTO livraisons (
  id_livraison, nom_destinataire, adresse_principale, complement_adresse,
  ville, pays, code_postal, date_livraison, heure_debut, heure_fin,
  notes, statut_livraison, id_client
) VALUES
(20, 'Marie Dupont', '5 Avenue des Champs', 'Appartement 3B', 'Paris', 'France', '75008', '2025-10-21', '09:00', '11:00', 'Livrer avant midi', 'Assigné à un livreur', 20),
(21, 'Tiana Randria', 'Boulevard de l''Europe 12', NULL, 'Antananarivo', 'Madagascar', '101', '2025-10-21', '13:00', '16:00', 'Client préfère livraison après-midi', 'Assigné à un livreur', 21);

/* =======================
   COLIS
   ======================= */
INSERT INTO colis (
  id_colis, code_barre_client_colis, poids_total, statut_colis,
  date_heure_chargement, date_heure_dechargement, date_heure_accuse_reception,
  date_heure_retour_expediteur, id_livraison
) VALUES
(20, 'COLIS-FR-2025-001', 2.5, 'Charge', '2025-10-21 08:45:00', NULL, NULL, NULL, 20),
(21, 'COLIS-MG-2025-002', 4.2, 'Charge', '2025-10-21 12:45:00', NULL, NULL, NULL, 21);

/* =======================
   PRODUITS
   ======================= */
INSERT INTO produits (ref_produit, description_produit, poids_produit, valeur_produit, id_colis)
VALUES
(20, 'Smartphone Samsung Galaxy S24', 0.5, 1200.00, 20),
(21, 'Coffret cadeau – Chocolats artisanaux', 1.2, 80.00, 20),
(22, 'Laptop HP Pavilion', 2.0, 1600.00, 21);

/* =======================
   TOURNEES LIVRAISON
   ======================= */
INSERT INTO tournees_livraison (
  id_tournee, date_tournee, heure_debut, heure_fin, statut, id_prestataire, id_livreur
) VALUES
(20, '2025-10-21', '08:00', '18:00', 'En cours', 20, 2);

/* =======================
   ORDRES LIVRAISON
   ======================= */
INSERT INTO ordres_livraison (
  id_ordre_livraison, point_obtenu, estimation_retard, nbr_colis_prevu,
  nbr_colis_reel, statut, id_point_livraison, id_tournee, id_livraison
) VALUES
(20, 0, NULL, 1, 1, 'Valide', 20, 20, 20),
(21, 0, NULL, 1, 1, 'Valide', 21, 20, 21);

/* =======================
   BORDEREAUX LIVRAISON
   ======================= */
INSERT INTO bordereaux_livraison (
  ref_bordereau_livraison, nom_expediteur, adresse_expediteur, contact_expediteur,
  nom_destinataire, adresse_destinataire, contact_destinataire, date_bordereau,
  date_livraison, id_ordre_livraison
) VALUES
('BL-FR-2025-001', 'Quick Service', '5 Avenue des Champs', '+33144556677',
 'Marie Dupont', '5 Avenue des Champs 75008 Paris', '+33677889900',
 '2025-10-21', '2025-10-21', 20),
('BL-MG-2025-002', 'Madagascar Express', 'Rue Antanimena', '+261340000777',
 'Tiana Randria', 'Boulevard de l''Europe 12, Antananarivo', '+261340889900',
 '2025-10-21', '2025-10-21', 21);

/* =======================
   NOTIFICATIONS
   ======================= */
-- INSERT INTO notifications (
--   id_notification, titre, message, id_envoyeur
-- ) VALUES
-- (20, 'Nouvelle tournée assignée', 'Une nouvelle tournée de livraison vous a été attribuée pour aujourd’hui.', 20),
-- (21, 'Livraison en cours', 'Votre colis est actuellement en cours de livraison.', 21);

/* =======================
   NOTIFICATIONS RECUS
   ======================= */
-- INSERT INTO notifications_recus (id_receveur, id_notification)
-- VALUES
-- (21, 20),
-- (20, 21);
