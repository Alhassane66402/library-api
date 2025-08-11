const express = require('express');
const router = express.Router();
const livreController = require('../controllers/bookController');
const auth = require('../middlewares/auth');
const validateBody = require('../middlewares/validateBody');
const Joi = require('joi');

const livreSchema = Joi.object({
  titre: Joi.string().min(3).max(100).required()
    .messages({
      'string.min': 'Le titre doit contenir au moins 3 caractères',
      'string.max': 'Le titre ne peut pas dépasser 100 caractères',
      'any.required': 'Le titre est obligatoire'
    }),
  auteur: Joi.string().min(3).max(50).required()
    .messages({
      'string.min': 'Le nom de l’auteur doit contenir au moins 3 caractères',
      'string.max': 'Le nom de l’auteur ne peut pas dépasser 50 caractères',
      'any.required': 'Le nom de l’auteur est obligatoire'
    }),
  resume: Joi.string().min(10).max(1000).required()
    .messages({
      'string.min': 'Le résumé doit contenir au moins 10 caractères',
      'string.max': 'Le résumé ne peut pas dépasser 1000 caractères',
      'any.required': 'Le résumé est obligatoire'
    }),
  datePublication: Joi.date().max('now').required()
    .messages({
      'date.base': 'La date de publication doit être une date valide',
      'date.max': 'La date de publication ne peut pas être dans le futur',
      'any.required': 'La date de publication est obligatoire'
    }),
  // `image` est uploadée via multipart/form-data, pas dans JSON
});

/**
 * @swagger
 * tags:
 *   - name: Livres
 *     description: Gestion des livres
 */

/**
 * @swagger
 * /api/books:
 *   get:
 *     summary: Liste les livres avec pagination, tri et filtres
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *         description: Numéro de page (défaut 1)
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *         description: Nombre d'éléments par page (défaut 10)
 *       - in: query
 *         name: tri
 *         schema:
 *           type: string
 *         description: Champ de tri, ex: createdAt, -titre
 *       - in: query
 *         name: titre
 *         schema:
 *           type: string
 *         description: Filtrer par titre (recherche partielle, insensible à la casse)
 *       - in: query
 *         name: auteur
 *         schema:
 *           type: string
 *         description: Filtrer par auteur (recherche partielle, insensible à la casse)
 *       - in: query
 *         name: datePublication
 *         schema:
 *           type: string
 *           format: date
 *         description: Filtrer par date de publication (format YYYY-MM-DD)
 *     responses:
 *       200:
 *         description: Liste paginée des livres filtrés
 */

/**
 * @swagger
 * /api/books:
 *   post:
 *     tags: [Livres]
 *     summary: Crée un nouveau livre
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required:
 *               - titre
 *               - auteur
 *               - resume
 *               - datePublication
 *             properties:
 *               titre:
 *                 type: string
 *                 description: Titre du livre
 *               auteur:
 *                 type: string
 *                 description: Nom de l'auteur
 *               resume:
 *                 type: string
 *                 description: Résumé du livre
 *               datePublication:
 *                 type: string
 *                 format: date
 *                 description: Date de publication (AAAA-MM-JJ)
 *               image:
 *                 type: string
 *                 format: binary
 *                 description: Image de couverture (JPEG ou PNG)
 *     responses:
 *       201:
 *         description: Livre créé avec succès
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Livre'
 *       400:
 *         description: Données invalides
 *       401:
 *         description: Non authentifié
 *       500:
 *         description: Erreur serveur
 */

/**
 * @swagger
 * /api/books/{id}:
 *   get:
 *     tags: [Livres]
 *     summary: Récupère un livre par son ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID du livre
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Livre trouvé
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Livre'
 *       404:
 *         description: Livre non trouvé
 *       500:
 *         description: Erreur serveur
 */

/**
 * @swagger
 * /api/books/{id}:
 *   put:
 *     tags: [Livres]
 *     summary: Met à jour un livre
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID du livre à mettre à jour
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               titre:
 *                 type: string
 *               auteur:
 *                 type: string
 *               resume:
 *                 type: string
 *               datePublication:
 *                 type: string
 *                 format: date
 *               image:
 *                 type: string
 *                 format: binary
 *     responses:
 *       200:
 *         description: Livre mis à jour avec succès
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Livre'
 *       400:
 *         description: Données invalides
 *       401:
 *         description: Non authentifié
 *       404:
 *         description: Livre non trouvé
 *       500:
 *         description: Erreur serveur
 */

/**
 * @swagger
 * /api/books/{id}:
 *   delete:
 *     tags: [Livres]
 *     summary: Supprime un livre
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID du livre à supprimer
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Livre supprimé avec succès
 *       401:
 *         description: Non authentifié
 *       404:
 *         description: Livre non trouvé
 *       500:
 *         description: Erreur serveur
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     Livre:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *           description: ID unique du livre
 *         titre:
 *           type: string
 *           description: Titre du livre
 *         auteur:
 *           type: string
 *           description: Nom de l'auteur
 *         resume:
 *           type: string
 *           description: Résumé du livre
 *         datePublication:
 *           type: string
 *           format: date
 *           description: Date de publication du livre
 *         image:
 *           type: string
 *           description: URL de l'image de couverture
 *         createdAt:
 *           type: string
 *           format: date-time
 *           description: Date de création dans la base
 *         updatedAt:
 *           type: string
 *           format: date-time
 *           description: Date de mise à jour dans la base
 */

router.get('/', livreController.listerLivres);
router.post('/', auth, validateBody(livreSchema), livreController.creerLivre);
router.get('/:id', livreController.getLivre);
router.put('/:id', auth, validateBody(livreSchema), livreController.mettreAJourLivre);
router.delete('/:id', auth, livreController.supprimerLivre);

module.exports = router;
