const winston = require('winston');
const {LogtailTransport} = require("@logtail/winston");
const {Logtail} = require("@logtail/node");
const { combine, timestamp, printf, colorize, align, json} = winston.format;

const logtail = new Logtail('QCpZgJAz6URhAuUXuFk3L2fE');


const userLogger = winston.createLogger({
    levels: winston.config.syslog.levels,
    transports: [
        new winston.transports.Console()
    ]
});
const authLogger = winston.createLogger({
    levels: winston.config.syslog.levels,

    transports: [
        new winston.transports.Console(),
        new winston.transports.File({ filename: '../logs/combined.log' }),
        new LogtailTransport(logtail)]

});

module.exports = {
    userLogger: userLogger,
    authLogger: authLogger
};

