const Livre = require('../models/Book');
const path = require('path');
const multer = require('multer');

// 📌 Configuration Multer pour téléversement d'images
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, 'uploads/'),
  filename: (req, file, cb) => cb(null, Date.now() + path.extname(file.originalname))
});

const upload = multer({
  storage,
  fileFilter: (req, file, cb) => {
    const typesAutorises = /jpeg|jpg|png/;
    const extname = typesAutorises.test(path.extname(file.originalname).toLowerCase());
    const mimetype = typesAutorises.test(file.mimetype);
    if (extname && mimetype) {
      cb(null, true);
    } else {
      cb(new Error('Seules les images JPEG et PNG sont autorisées'));
    }
  }
});

// 📌 Créer un livre
exports.creerLivre = [
  upload.single('image'),
  async (req, res) => {
    const { titre, auteur, resume, datePublication } = req.body;

    try {
      const baseUrl = `${req.protocol}://${req.get('host')}`;
      const nouveauLivre = new Livre({
        titre,
        auteur,
        resume,
        datePublication,
        image: req.file ? `${baseUrl}/uploads/${req.file.filename}` : null
      });

      await nouveauLivre.save();

      res.status(201).json({
        message: 'Livre créé avec succès',
        livre: nouveauLivre
      });
    } catch (err) {
      // Gérer erreur Multer (upload)
      if (err instanceof multer.MulterError || err.message.includes('images JPEG et PNG')) {
        return res.status(400).json({ message: err.message });
      }
      res.status(500).json({ message: 'Erreur serveur', erreur: err.message });
    }
  }
];

// 📌 Lister les livres avec pagination et tri
exports.listerLivres = async (req, res) => {
  let { page = 1, limit = 10, tri = 'createdAt', titre, auteur, datePublication } = req.query;
  page = parseInt(page);
  limit = parseInt(limit);

  if (isNaN(page) || page < 1) page = 1;
  if (isNaN(limit) || limit < 1) limit = 10;

  // Construire le filtre
  const filtre = {};

  if (titre) {
    filtre.titre = { $regex: titre, $options: 'i' };
  }
  if (auteur) {
    filtre.auteur = { $regex: auteur, $options: 'i' };
  }
  if (datePublication) {
    filtre.datePublication = new Date(datePublication);
  }

  try {
    const livres = await Livre.find(filtre)
      .limit(limit)
      .skip((page - 1) * limit)
      .sort(tri);

    const total = await Livre.countDocuments(filtre);

    res.json({
      totalLivres: total,
      totalPages: Math.ceil(total / limit),
      pageActuelle: page,
      livres
    });
  } catch (err) {
    res.status(500).json({ message: 'Erreur serveur', erreur: err.message });
  }
};



// 📌 Récupérer un livre par ID
exports.getLivre = async (req, res) => {
  try {
    const livre = await Livre.findById(req.params.id);
    if (!livre) {
      return res.status(404).json({ message: 'Livre non trouvé' });
    }
    res.json(livre);
  } catch (err) {
    // Gestion d'erreur si l'ID est mal formé
    if (err.kind === 'ObjectId') {
      return res.status(400).json({ message: "ID de livre invalide" });
    }
    res.status(500).json({ message: 'Erreur serveur', erreur: err.message });
  }
};

// 📌 Mettre à jour un livre
exports.mettreAJourLivre = [
  upload.single('image'),
  async (req, res) => {
    try {
      const baseUrl = `${req.protocol}://${req.get('host')}`;
      const livre = await Livre.findById(req.params.id);
      if (!livre) {
        return res.status(404).json({ message: 'Livre non trouvé' });
      }

      // Mettre à jour uniquement si présent dans le body
      if (req.body.titre) livre.titre = req.body.titre;
      if (req.body.auteur) livre.auteur = req.body.auteur;
      if (req.body.resume) livre.resume = req.body.resume;
      if (req.body.datePublication) livre.datePublication = req.body.datePublication;
      if (req.file) livre.image = `${baseUrl}/uploads/${req.file.filename}`;

      await livre.save();

      res.json({
        message: 'Livre mis à jour avec succès',
        livre
      });
    } catch (err) {
      if (err.kind === 'ObjectId') {
        return res.status(400).json({ message: "ID de livre invalide" });
      }
      if (err instanceof multer.MulterError || err.message.includes('images JPEG et PNG')) {
        return res.status(400).json({ message: err.message });
      }
      res.status(500).json({ message: 'Erreur serveur', erreur: err.message });
    }
  }
];

// 📌 Supprimer un livre
exports.supprimerLivre = async (req, res) => {
  try {
    const livre = await Livre.findById(req.params.id);
    if (!livre) {
      return res.status(404).json({ message: 'Livre non trouvé' });
    }

    await livre.deleteOne();

    res.json({ message: 'Livre supprimé avec succès' });
  } catch (err) {
    if (err.kind === 'ObjectId') {
      return res.status(400).json({ message: "ID de livre invalide" });
    }
    res.status(500).json({ message: 'Erreur serveur', erreur: err.message });
  }
};
