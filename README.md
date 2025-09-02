## Configuration base de données

### Modifie le fichier .env dans backend/gestion-livraison-de-colis/.env
``
* DATABASE_HOST= Localhost ou IP
* DATABASE_PORT= port utilisé par votre postgresql
* DATABASE_USER=Votre nom d'utilisateur postgresql
* DATABASE_PASSWORD=Votre mot de passe
* DATABASE_NAME= Le nom de la base de donnée

``
### Créer les tables Necessaire dans le dossier database/script-sql
    Utiliser le fichier tables-used.Sql

### Inserer les données necessaire dans le dossier database/script-sql
1. constraintes.sql
2. default_data.qql

## Configuration JWT Token

Modifie le fichier .env dans backend/gestion-livraison-de-colis/.env
```
    JWT_SECRET=my_keys
    JWT_EXPIRES_IN=90000s
```

## Configuration CORSS

Modifie le fichier .env dans backend/gestion-livraison-de-colis/.env
```
CLIENT_DOMAINE_NAME= http://localhost
CLIENT_PORT= Port que vous utilisez

```
Le nom de domaine que vous utilisez pour eviter le probleme de CORSS

## Documentation

Tapez http://localhost:votre-port/docs pour voir la documentation d'utilisation de l'API

## Default Data test
Pour inserer les données de test par default pour les tables suivants:
- Utilisateur
- Prestataire
- Livreur
- Point de livraison
- Contrainte de livraison
- Colis
- Livraison
- Planning
- Tournée

run:
```
    npm run seed
```

## Pour le notification en temps réel
Allez dans le dossier test/livreur.js pour voir comment interagir avec le socket de l'API.

N'oublie pas de modifier le fichier .env pour eviter le probléme de <b> CORS </b>.