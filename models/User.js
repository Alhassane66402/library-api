const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

// Définition du schéma Utilisateur
const utilisateurSchema = new mongoose.Schema(
  {
    nomUtilisateur: {
      type: String,
      required: [true, 'Le nom d’utilisateur est obligatoire'],
      minlength: [3, 'Le nom d’utilisateur doit contenir au moins 3 caractères'],
      maxlength: [30, 'Le nom d’utilisateur ne peut pas dépasser 30 caractères'],
      trim: true
    },
    email: {
      type: String,
      required: [true, 'L’adresse e-mail est obligatoire'],
      unique: true,
      lowercase: true,
      trim: true,
      match: [
        /^\S+@\S+\.\S+$/,
        'L’adresse e-mail doit être valide'
      ]
    },
    motDePasse: {
      type: String,
      required: [true, 'Le mot de passe est obligatoire'],
      minlength: [6, 'Le mot de passe doit contenir au moins 6 caractères']
    },
    role: {
      type: String,
      enum: ['utilisateur', 'admin'],
      default: 'utilisateur'
    }
  },
  { timestamps: true }
);

// Middleware Mongoose : hachage du mot de passe avant sauvegarde
utilisateurSchema.pre('save', async function (next) {
  if (!this.isModified('motDePasse')) return next();
  const salt = await bcrypt.genSalt(10);
  this.motDePasse = await bcrypt.hash(this.motDePasse, salt);
  next();
});

// Méthode pour comparer les mots de passe
utilisateurSchema.methods.verifierMotDePasse = async function (motDePasseEntre) {
  return await bcrypt.compare(motDePasseEntre, this.motDePasse);
};

module.exports = mongoose.model('Utilisateur', utilisateurSchema);
