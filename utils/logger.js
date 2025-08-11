const path = require('path');
const winston = require('winston');

const { combine, timestamp, printf, json, colorize } = winston.format;

// Format lisible pour la console
const consoleFormat = combine(
  colorize(),
  timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
  printf(({ timestamp, level, message, ...meta }) => {
    const metaString = Object.keys(meta).length ? JSON.stringify(meta, null, 2) : '';
    return `${timestamp} [${level}]: ${message} ${metaString}`;
  })
);

const logger = winston.createLogger({
  level: 'info',
  format: combine(
    timestamp(),
    json()
  ),
  transports: [
    new winston.transports.Console({
      format: consoleFormat,
      level: process.env.NODE_ENV === 'development' ? 'debug' : 'info',
    }),
    new winston.transports.File({
      filename: path.join('logs', 'error.log'),
      level: 'error',
      handleExceptions: true
    }),
    new winston.transports.File({
      filename: path.join('logs', 'combined.log'),
      handleExceptions: true
    })
  ],
  exitOnError: false,
});

// Capturer les exceptions non gérées
process.on('unhandledRejection', (ex) => {
  throw ex;
});

module.exports = logger;
