const winston = require('winston');
const {LogtailTransport} = require("@logtail/winston");
const {Logtail} = require("@logtail/node");
const { combine, timestamp, printf, colorize, align, json} = winston.format;

const logtail = new Logtail('QCpZgJAz6URhAuUXuFk3L2fE');

require("winston-daily-rotate-file");

//Label
const CATEGORY = "Log Rotation";


//DailyRotateFile func()
const fileRotateTransport = new winston.transports.DailyRotateFile({
    filename: "logs/rotate-%DATE%.log",
    datePattern: "YYYY-MM-DD",
    maxFiles: "14d",
});


const userLogger = winston.createLogger({
    levels: winston.config.syslog.levels,
    transports: [
        new winston.transports.Console()
    ]
});
const authLogger = winston.createLogger({
    levels: winston.config.syslog.levels,
    transports: [
        fileRotateTransport,
        new winston.transports.Console(),
        new winston.transports.File({ filename: '../logs/combined.log' }),
        new LogtailTransport(logtail)
    ]

});

const genericLogger = winston.createLogger({
    levels: winston.config.syslog.levels,
    transports: [
        new winston.transports.Console(),
        new winston.transports.File({ filename: '../logs/combined.log' }),
        new LogtailTransport(logtail)
    ]
});

module.exports = {
    userLogger: userLogger,
    authLogger: authLogger,
    genericLogger: genericLogger
};

