const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
  const authHeader = req.header('Authorization');
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Token manquant ou mal formaté, accès refusé' });
  }

  const token = authHeader.replace('Bearer ', '').trim();

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // contient id et role
    next();
  } catch (err) {
    console.error('Erreur de vérification du token JWT:', err.message);
    return res.status(401).json({ message: 'Token invalide ou expiré' });
  }
};
