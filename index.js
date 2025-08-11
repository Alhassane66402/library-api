const express = require('express');
const dotenv = require('dotenv');
const helmet = require('helmet');
const cors = require('cors');
const path = require('path');
const morgan = require('morgan');
const logger = require('./utils/logger');
const rateLimit = require('express-rate-limit');
const swaggerUi = require('swagger-ui-express');
const specs = require('./swagger');
const connectDB = require('./config/db');

// Charger les variables d'environnement
dotenv.config();

// Initialisation de l'application
const app = express();

// Sécurité & parsing
app.use(helmet());
app.use(cors());
app.use(express.json());

// Limiteur de requêtes (après helmet et cors)
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 min
  max: 100, // Limite par IP
  message: { msg: 'Trop de requêtes, veuillez réessayer plus tard.' }
});
app.use(limiter);

// Logger HTTP
app.use(morgan('combined', { stream: { write: msg => logger.info(msg.trim()) } }));

// Fichiers statiques
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Documentation API (uniquement en développement)
if (process.env.NODE_ENV === 'development') {
  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs));
}

// Routes
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/books', require('./routes/bookRoutes'));

// Middleware de gestion des erreurs
app.use(require('./middlewares/errorHandler'));

// Démarrage après connexion à MongoDB
const PORT = process.env.PORT || 5000;
connectDB()
  .then(() => {
    app.listen(PORT, () => console.log(`🚀 Serveur lancé sur le port ${PORT}`));
  })
  .catch(err => {
    console.error('❌ Impossible de démarrer le serveur :', err.message);
    process.exit(1);
  });
