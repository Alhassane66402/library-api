const mongoose = require('mongoose');

const livreSchema = new mongoose.Schema(
  {
    titre: {
      type: String,
      required: [true, 'Le titre du livre est obligatoire'],
      minlength: [3, 'Le titre doit contenir au moins 3 caractères'],
      maxlength: [100, 'Le titre ne peut pas dépasser 100 caractères'],
      trim: true
    },
    auteur: {
      type: String,
      required: [true, 'Le nom de l’auteur est obligatoire'],
      minlength: [3, 'Le nom de l’auteur doit contenir au moins 3 caractères'],
      maxlength: [50, 'Le nom de l’auteur ne peut pas dépasser 50 caractères'],
      trim: true
    },
    resume: {
      type: String,
      required: [true, 'Le résumé est obligatoire'],
      minlength: [10, 'Le résumé doit contenir au moins 10 caractères'],
      maxlength: [1000, 'Le résumé ne peut pas dépasser 1000 caractères'],
      trim: true
    },
    image: {
      type: String,
      default: null,
      validate: {
        validator: function (v) {
          return !v || /^https?:\/\/.+\.(jpg|jpeg|png|gif|webp)$/i.test(v);
        },
        message: 'L’URL de l’image doit être valide (formats acceptés : jpg, jpeg, png, gif, webp)'
      }
    },
    datePublication: {
      type: Date,
      required: [true, 'La date de publication est obligatoire'],
      validate: {
        validator: function (value) {
          return value <= new Date();
        },
        message: 'La date de publication ne peut pas être dans le futur'
      }
    }
  },
  { timestamps: true }
);

// Index pour recherche rapide par titre ou auteur
livreSchema.index({ titre: 'text', auteur: 'text' });

module.exports = mongoose.model('Livre', livreSchema);
