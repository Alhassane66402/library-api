const logger = require('../utils/logger');

module.exports = (err, req, res, next) => {
  // Log de l'erreur avec méthode et url
  logger.error(`${err.message || 'Erreur inconnue'} - ${req.method} ${req.url}`);

  res.status(err.status || 500).json({
    message: process.env.NODE_ENV === 'development' ? err.message : 'Une erreur est survenue',
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  });
};
