export enum StatusLivraison {
    // Le colis est en attente de traitement ou d'action (ex: confirmation, préparation, etc.)
    EN_ATTENTE = "En attente",

    // La commande a été annulée, soit par le client, soit par l'expéditeur ou le transporteur.
    ANNULE = "Annulé",

    // Le colis a été attribué à un livreur pour la livraison.
    DISTRIBUEUR_ASSIGNÉ = "Assigné à un livreur",

    // Le colis a quitté l'entrepôt et a été envoyé vers la destination.
    EN_EXPEDIE = "Expédié",

    // Le colis est en déplacement vers la destination finale, mais n'a pas encore atteint sa destination.
    EN_TRANSIT = "En transit",

    // Le colis est en route pour être livré à l'adresse du destinataire.
    EN_COURS_LIVRAISON = "En cours de livraison",

    // Une partie de la commande a été livrée, le reste est en attente.
    LIVRAISON_PARTIELLE = "Livraison partielle",

    // La tentative de livraison a échoué (ex: destinataire absent, adresse incorrecte, etc.)
    ECHEC_LIVRAISON = "Echec de livraison",

    // Le colis est retourné à l'expéditeur après un échec de livraison ou une adresse incorrecte.
    RETOUR_EXPEDITEUR = "Retour à l'expediteur",

    // Le colis a été livré au destinataire avec succès.
    LIVRE = "Livré",
}
