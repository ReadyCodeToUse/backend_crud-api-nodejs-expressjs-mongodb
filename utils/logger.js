const winston = require('winston');
const { LogtailTransport } = require('@logtail/winston');
const { Logtail } = require('@logtail/node');

const logtail = new Logtail('QCpZgJAz6URhAuUXuFk3L2fE');

require('winston-daily-rotate-file');

/*
const fileRotateTransport = new winston.transports.DailyRotateFile({
  filename: 'logs/rotate-%DATE%.log',
  datePattern: 'YYYY-MM-DD',
  maxFiles: '14d',
});
 */

const userLogger = winston.createLogger({
  levels: winston.config.syslog.levels,
  colorize: true,
  transports: [
    // fileRotateTransport,
    new winston.transports.Console(),
    // new winston.transports.File({ filename: '../logs/combined.log' }),
    new LogtailTransport(logtail),
  ],
});
const authLogger = winston.createLogger({
  levels: winston.config.syslog.levels,
  colorize: true,
  transports: [
    // fileRotateTransport,
    new winston.transports.Console(),
    // new winston.transports.File({ filename: '../logs/combined.log' }),
    new LogtailTransport(logtail),
  ],

});

const genericLogger = winston.createLogger({
  levels: winston.config.syslog.levels,
  colorize: true,
  transports: [
    // fileRotateTransport,
    new winston.transports.Console(),
    new winston.transports.File({ filename: '../logs/combined.log' }),
    new LogtailTransport(logtail),
  ],
});

module.exports = {
  userLogger,
  authLogger,
  genericLogger,
};
