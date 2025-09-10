## Configuration base de données

### Modifie le fichier .env dans backend/gestion-livraison-de-colis/.env
``
* DATABASE_HOST= Localhost ou IP
* DATABASE_PORT= port utilisé par votre postgresql
* DATABASE_USER=Votre nom d'utilisateur postgresql
* DATABASE_PASSWORD=Votre mot de passe
* DATABASE_NAME= Le nom de la base de donnée

``

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

Tapez <b>http://localhost:votre-port/docs </b> pour voir la documentation d'utilisation de l'API

## Default Data test
Pour inserer les données de test par default pour les tables suivants:
- Utilisateur
- Prestataire
- Livreur
- Point de livraison
- Contrainte de livraison

run:
```
    npm run seed
```
### Login
Voici quelque extrait de données inserées par default (veuillez aller dans /core/seed/seed.service pour voir les autres utilisateurs):

- Admin Tempo One:
    - login: <b>admin@gmail.com</b>
    - password: <b>AdminPassword!123</b>

- Admin Prestataire 1:
    - login: ramaro.lahy@solutionsit.mg
    - password: Secur1tyPass!2023

- Admin Prestataire 2:
    - login: rova.nadine@webdev-experts.mg
    - password: WebDev@12345

- Admin Prestataire 3:
    - login: rajao.marie@digitalsolutions.mg
    - password: D1g!t@lPass2023

- Livreur Novice:
    - login: livreur.novice@gmail.com
    - password: livreurNovice123!

- Livreur Ponctual:
    - login: livreur.ponctuel@gmail.com
    - password: livreurPoctuel123!

- Livreur Regulier:
    - login: livreur.regulier@gmail.com
    - password: livreurRegulier123!


## Pour le notification en temps réel
Allez dans le dossier test/livreur.js pour voir comment interagir avec le socket de l'API.

N'oublie pas de modifier le fichier .env pour eviter le probléme de <b> CORS </b>.