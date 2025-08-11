const swaggerJsdoc = require('swagger-jsdoc');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'API Bibliothèque',
      version: '1.0.0',
      description: 'API REST pour gérer une bibliothèque',
      contact: {
        name: 'Ton Nom',
        email: 'contact@exemple.com'
      }
    },
    servers: [
      {
        url: 'http://localhost:5000',
        description: 'Serveur local'
      }
      // tu peux ajouter d'autres serveurs (prod, staging) ici
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT'
        }
      }
    },
    security: [
      {
        bearerAuth: []
      }
    ],
    tags: [
      { name: 'Auth', description: 'Opérations d’authentification' },
      { name: 'Livres', description: 'Gestion des livres' }
    ]
  },
  apis: ['./routes/*.js'] // Scanner les fichiers de routes pour commentaires JSDoc
};

const specs = swaggerJsdoc(options);
module.exports = specs;
