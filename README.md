
# API REST pour une Bibliothèque

## Description  
Cette API permet de gérer une collection de livres avec un système complet d’authentification et de gestion des ressources. Elle supporte :  
- Inscription, connexion et gestion sécurisée des utilisateurs via JWT.  
- Création, lecture, mise à jour, suppression (CRUD) des livres.  
- Téléversement d’images de couverture pour les livres (formats JPG, PNG).  
- Pagination, tri, et filtrage des livres dans les requêtes GET.  
- Validation des données et gestion des erreurs.

---

## Table des matières
- [Installation](#installation)  
- [Variables d’environnement](#variables-denvironnement)  
- [Fonctionnalités](#fonctionnalités)  
- [Endpoints API](#endpoints-api)  
- [Exemples d’appels avec Postman](#exemples-dappels-avec-postman)  
- [Déploiement](#déploiement)  
- [Contribution](#contribution)  
- [Licence](#licence)  

---

## Installation

1. **Cloner le dépôt :**  
   ```bash
   git clone https://github.com/ton-utilisateur/nom-du-repo.git
   cd nom-du-repo
   ```  
2. **Installer les dépendances :**  
   ```bash
   npm install
   ```  
3. **Créer le dossier pour stocker les images uploadées :**  
   ```bash
   mkdir uploads
   ```  
4. **Configurer les variables d’environnement :**  
   Copier le fichier `.env.example` en `.env` et compléter les variables (cf. section dédiée).  
5. **Lancer le serveur :**  
   En développement (avec reload automatique) :  
   ```bash
   npm run dev
   ```  
   En production :  
   ```bash
   npm start
   ```  
6. **Tester l’API via Postman ou un autre outil de test d’API.**

---

## Variables d’environnement

Le fichier `.env` doit contenir au minimum :  

```env
PORT=3000                      # Port d’écoute du serveur
MONGODB_URI=mongodb://localhost:27017/ma_bibliotheque  # URL MongoDB
JWT_SECRET=maCleSecreteJWT123  # Clé secrète pour signer les tokens JWT
```

---

## Fonctionnalités détaillées

### 1. Authentification & Gestion utilisateur

- **POST /api/auth/register**  
  Crée un nouvel utilisateur.  
  **Corps JSON :**  
  ```json
  {
    "username": "utilisateur123",
    "email": "utilisateur@example.com",
    "password": "motdepassefort"
  }
  ```  
  **Réponse :**  
  - 201 Created avec message de succès  
  - 400 Bad Request si données invalides ou utilisateur existant  

- **POST /api/auth/login**  
  Connexion utilisateur, retourne un token JWT.  
  **Corps JSON :**  
  ```json
  {
    "email": "utilisateur@example.com",
    "password": "motdepassefort"
  }
  ```  
  **Réponse :**  
  ```json
  {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
  ```  
  Utiliser ce token pour accéder aux routes protégées.

- **GET /api/auth/profile**  
  Récupère les informations du profil connecté.  
  **Headers :**  
  ```
  Authorization: Bearer <token_jwt>
  ```  
  **Réponse :**  
  ```json
  {
    "username": "utilisateur123",
    "email": "utilisateur@example.com",
    "createdAt": "2025-08-11T08:00:00Z"
  }
  ```

---

### 2. Gestion des livres (CRUD)

Toutes les routes nécessitent le token JWT dans l’en-tête sauf pour la lecture.

- **POST /api/books**  
  Crée un nouveau livre.  
  **Headers :**  
  ```
  Authorization: Bearer <token_jwt>
  Content-Type: multipart/form-data
  ```  
  **Corps (multipart/form-data) :**  
  - `title` (string, requis)  
  - `author` (string, requis)  
  - `summary` (string, optionnel)  
  - `datePublication` (date ISO, optionnel)  
  - `image` (fichier, formats acceptés : jpg, jpeg, png)  

  **Réponse :**  
  - 201 Created avec objet livre créé.

- **GET /api/books**  
  Liste les livres avec pagination, tri et filtres.  
  **Paramètres query optionnels :**  
  - `page` (nombre, défaut 1)  
  - `limit` (nombre, défaut 10)  
  - `sort` (champ pour tri, ex : createdAt ou title)  
  - `title` (string, filtre par titre partiel)  
  - `author` (string, filtre par auteur partiel)  
  - `datePublication` (date ISO, filtre par date exacte)  

  **Exemple d’URL :**  
  ```
  GET /api/books?page=2&limit=5&sort=title&author=tolkien
  ```  
  **Réponse :**  
  ```json
  {
    "totalLivres": 35,
    "totalPages": 7,
    "pageActuelle": 2,
    "livres": [
      {
        "_id": "64db1c8a1f...",
        "title": "Le Seigneur des Anneaux",
        "author": "J.R.R. Tolkien",
        "summary": "Épopée fantastique...",
        "datePublication": "1954-07-29T00:00:00Z",
        "image": "http://localhost:3000/uploads/image1.jpg"
      }
    ]
  }
  ```

- **GET /api/books/:id**  
  Récupère un livre par son ID MongoDB.  
  **Réponse :** Objet livre complet ou 404 si non trouvé.

- **PUT /api/books/:id**  
  Met à jour un livre existant.  
  **Headers :**  
  ```
  Authorization: Bearer <token_jwt>
  Content-Type: multipart/form-data
  ```  
  **Corps (multipart/form-data) :**  
  Champs optionnels (comme en POST).  

  **Réponse :**  
  Objet livre mis à jour.

- **DELETE /api/books/:id**  
  Supprime un livre par ID.  
  **Headers :**  
  ```
  Authorization: Bearer <token_jwt>
  ```  
  **Réponse :** Message de confirmation.

---

## Gestion des erreurs

L’API renvoie systématiquement un JSON en cas d’erreur avec un statut HTTP adapté :  

```json
{
  "message": "Description de l'erreur",
  "erreur": "Détail technique (optionnel)"
}
```

---

## Exemples d’appels API (Postman)

### Exemple : Créer un livre avec image

- Méthode : POST  
- URL : `http://localhost:3000/api/books`  
- Headers :  
  ```
  Authorization: Bearer <ton_token>
  Content-Type: multipart/form-data
  ```  
- Body (form-data) :  
  | Key           | Value                           | Type      |
  |---------------|--------------------------------|-----------|
  | title         | Le Petit Prince                 | Text      |
  | author        | Antoine de Saint-Exupéry        | Text      |
  | summary       | Un conte poétique et philosophique | Text   |
  | datePublication | 1943-04-06                   | Text      |
  | image         | [choisir un fichier JPG/PNG]   | File      |

---

### Exemple : Filtrer et paginer les livres

- Méthode : GET  
- URL : `http://localhost:3000/api/books?page=1&limit=5&sort=title&author=tolkien`  
- Pas d’authentification requise.

---

## Déploiement

- Héberger le serveur Node.js sur un service cloud (Heroku, Render, AWS Elastic Beanstalk, etc.).  
- Utiliser une base de données MongoDB cloud (ex : MongoDB Atlas).  
- Configurer les variables d’environnement (`PORT`, `MONGODB_URI`, `JWT_SECRET`) dans l’interface du service.  
- Adapter le stockage des images (ex : passer à un stockage cloud comme AWS S3 si besoin).

---

## Contribution

Les contributions sont les bienvenues :  
- Forker le dépôt.  
- Créer une branche pour ta fonctionnalité (`feature/ma-fonctionnalite`).  
- Commiter avec des messages clairs.  
- Ouvrir une Pull Request.

---

## Licence

Ce projet est sous licence **MIT**. Voir le fichier `LICENSE` pour plus d’informations.
