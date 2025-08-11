# API REST pour une Bibliothèque

## Description
API REST pour gérer une collection de livres avec authentification, validation, pagination, tri et téléversement de fichiers.

## Fonctionnalités
- **Authentification** : Inscription/connexion avec JWT, profil utilisateur.
- **Gestion des livres** :
  - POST /api/books : Créer un livre (authentification requise).
  - GET /api/books : Lister les livres (pagination et tri).
  - GET /api/books/:id : Détail d'un livre.
  - PUT /api/books/:id : Modifier un livre (authentification requise).
  - DELETE /api/books/:id : Supprimer un livre (authentification requise).
  - POST /api/books (avec fichier) : Téléverser une couverture.

## Installation
1. Cloner le dépôt.
2. Exécuter `npm install`.
3. Créer un dossier `uploads/` dans la racine.
4. Renommer `.env.example` en `.env` et remplir les variables.
5. Lancer : `npm start` ou `npm run dev` (avec nodemon).

## Endpoints
### Authentification
- **POST /api/auth/register** : Inscription
  - Corps : `{ "username": "string", "password": "string" }`
- **POST /api/auth/login** : Connexion
  - Corps : `{ "username": "string", "password": "string" }`
  - Retour : `{ "token": "jwt_token" }`
- **GET /api/auth/profile** : Profil utilisateur
  - En-tête : `Authorization: Bearer <token>`

### Livres
- **POST /api/books** : Créer un livre
  - En-tête : `Authorization: Bearer <token>`
  - Corps (multipart/form-data) : `{ "title": "string", "author": "string", "summary": "string", "image": file }`
- **GET /api/books?page=1&limit=10&sort=createdAt** : Lister les livres
- **GET /api/books/:id** : Détail d'un livre
- **PUT /api/books/:id** : Modifier un livre
  - En-tête : `Authorization: Bearer <token>`
  - Corps (multipart/form-data) : `{ "title": "string", "author": "string", "summary": "string", "image": file }`
- **DELETE /api/books/:id** : Supprimer un livre
  - En-tête : `Authorization: Bearer <token>`

## Tests avec Postman
1. Importer la collection Postman depuis ce dépôt.
2. Tester chaque endpoint avec les en-têtes et corps appropriés.

## Déploiement
- Configurez un fournisseur cloud (Heroku, Render, etc.).
- Assurez-vous que MongoDB est accessible.
- Ajoutez les variables d'environnement sur la plateforme.