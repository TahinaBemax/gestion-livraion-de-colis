## Configuration base de données

### Modifie le fichier .env dans backend/gestion-livraison-de-colis/.env
``
* DATABASE_HOST=localhost
* DATABASE_PORT=5432
* DATABASE_USER=Votre nom d'utilisateur postgres
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
CLIENT_ORIGIN=http://localhost:5173 
```
Le nom de domaine que vous utilisez pour eviter le probleme de CORSS

## Documentation

Tapez http://localhost:votre-port/docs pour voir la documentation d'utilisation de l'API

## Default Data test
run:
```
    npm run seed
```