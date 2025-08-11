const jwt = require('jsonwebtoken');
const Utilisateur = require('../models/User');

// 📌 Générer un token JWT
const genererToken = (utilisateur) => {
  return jwt.sign(
    { id: utilisateur._id, role: utilisateur.role },
    process.env.JWT_SECRET,
    { expiresIn: '1h' }
  );
};

// 📌 Inscription
exports.inscription = async (req, res) => {
  const { nomUtilisateur, email, motDePasse, role } = req.body;

  try {
    // Vérifier si l'email ou le nom d'utilisateur existe déjà
    const utilisateurExistant = await Utilisateur.findOne({ email });

    if (utilisateurExistant) {
      return res.status(400).json({ message: 'Cet email est déjà utilisé' });
    }

    // Création et sauvegarde
    const nouvelUtilisateur = new Utilisateur({
      nomUtilisateur,
      email,
      motDePasse, // sera haché automatiquement par le middleware pre('save')
      role
    });

    await nouvelUtilisateur.save();

    res.status(201).json({
      message: 'Utilisateur créé avec succès',
      utilisateur: {
        id: nouvelUtilisateur._id,
        nomUtilisateur: nouvelUtilisateur.nomUtilisateur,
        email: nouvelUtilisateur.email,
        role: nouvelUtilisateur.role
      }
    });
  } catch (err) {
    res.status(500).json({ message: 'Erreur serveur', erreur: err.message });
  }
};

// 📌 Connexion
exports.connexion = async (req, res) => {
  const { email, motDePasse } = req.body;

  try {
    const utilisateur = await Utilisateur.findOne({ email });
    if (!utilisateur) {
      return res.status(400).json({ message: 'Utilisateur non trouvé' });
    }

    // Vérification du mot de passe avec la méthode du modèle
    const motDePasseValide = await utilisateur.verifierMotDePasse(motDePasse);
    if (!motDePasseValide) {
      return res.status(400).json({ message: 'Mot de passe incorrect' });
    }

    // Générer le token
    const token = genererToken(utilisateur);

    res.json({
      message: 'Connexion réussie',
      token,
      utilisateur: {
        id: utilisateur._id,
        nomUtilisateur: utilisateur.nomUtilisateur,
        email: utilisateur.email,
        role: utilisateur.role
      }
    });
  } catch (err) {
    res.status(500).json({ message: 'Erreur serveur', erreur: err.message });
  }
};

// 📌 Profil (route protégée)
exports.getProfil = async (req, res) => {
  try {
    const utilisateur = await Utilisateur.findById(req.user.id).select('-motDePasse');
    if (!utilisateur) {
      return res.status(404).json({ message: 'Utilisateur non trouvé' });
    }
    res.json(utilisateur);
  } catch (err) {
    res.status(500).json({ message: 'Erreur serveur', erreur: err.message });
  }
};
