const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const validateBody = require('../middlewares/validateBody');
const auth = require('../middlewares/auth');
const Joi = require('joi');

const schemaInscription = Joi.object({
  nomUtilisateur: Joi.string().min(3).max(30).required()
    .messages({
      'string.min': 'Le nom d’utilisateur doit contenir au moins 3 caractères',
      'string.max': 'Le nom d’utilisateur ne peut pas dépasser 30 caractères',
      'any.required': 'Le nom d’utilisateur est obligatoire'
    }),
  email: Joi.string().email().required()
    .messages({
      'string.email': "L'adresse e-mail doit être valide",
      'any.required': "L'adresse e-mail est obligatoire"
    }),
  motDePasse: Joi.string().min(6).required()
    .messages({
      'string.min': 'Le mot de passe doit contenir au moins 6 caractères',
      'any.required': 'Le mot de passe est obligatoire'
    }),
  role: Joi.string().valid('utilisateur', 'admin').optional()
});

const schemaConnexion = Joi.object({
  email: Joi.string().email().required()
    .messages({
      'string.email': "L'adresse e-mail doit être valide",
      'any.required': "L'adresse e-mail est obligatoire"
    }),
  motDePasse: Joi.string().required()
    .messages({
      'any.required': 'Le mot de passe est obligatoire'
    })
});

/**
 * @swagger
 * tags:
 *   - name: Authentification
 *     description: Gestion des utilisateurs et authentification
 */

/**
 * @swagger
 * /api/auth/inscription:
 *   post:
 *     tags: [Authentification]
 *     summary: Crée un nouvel utilisateur
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - nomUtilisateur
 *               - email
 *               - motDePasse
 *             properties:
 *               nomUtilisateur:
 *                 type: string
 *                 description: Nom d’utilisateur (unique)
 *               email:
 *                 type: string
 *                 format: email
 *                 description: Adresse e-mail valide
 *               motDePasse:
 *                 type: string
 *                 format: password
 *                 description: Mot de passe (min 6 caractères)
 *               role:
 *                 type: string
 *                 enum: [utilisateur, admin]
 *                 description: Rôle de l’utilisateur (optionnel)
 *     responses:
 *       201:
 *         description: Utilisateur créé avec succès
 *       400:
 *         description: Données invalides
 *       500:
 *         description: Erreur serveur
 */

/**
 * @swagger
 * /api/auth/connexion:
 *   post:
 *     tags: [Authentification]
 *     summary: Connecte un utilisateur et retourne un token JWT
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - motDePasse
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 description: Adresse e-mail enregistrée
 *               motDePasse:
 *                 type: string
 *                 format: password
 *                 description: Mot de passe
 *     responses:
 *       200:
 *         description: Authentification réussie
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 token:
 *                   type: string
 *                   description: Token JWT à utiliser pour les routes protégées
 *       400:
 *         description: Données invalides ou utilisateur non trouvé
 *       500:
 *         description: Erreur serveur
 */

/**
 * @swagger
 * /api/auth/profil:
 *   get:
 *     tags: [Authentification]
 *     summary: Récupère le profil de l’utilisateur connecté
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Profil utilisateur
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 _id:
 *                   type: string
 *                 nomUtilisateur:
 *                   type: string
 *                 email:
 *                   type: string
 *                 role:
 *                   type: string
 *       401:
 *         description: Non authentifié ou token invalide
 *       500:
 *         description: Erreur serveur
 */

router.post('/inscription', validateBody(schemaInscription), authController.inscription);
router.post('/connexion', validateBody(schemaConnexion), authController.connexion);
router.get('/profil', auth, authController.getProfil);

module.exports = router;
