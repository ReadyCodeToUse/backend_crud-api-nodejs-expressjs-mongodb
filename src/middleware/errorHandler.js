const moment = require("moment/moment");
const {
    authLogger,
    genericLogger
} = require("../../utils/logger");
const errorHandler = (err, req, res, next) => {
    console.log('Middleware error handler');

    // Error for Mongoose operation
    // Mongoose Validation error
    // handle field formatting, empty fields, and mismatched passwords
    if(err.name === 'ValidationError') {
        let errors = Object.values(err.errors).map(el => el.message);
        let fields = Object.values(err.errors).map(el => el.path);
        let code = 400;

        if(errors.length > 1) {
            const formattedErrors = errors.join(' ');

            const response = {
                timestamp: moment.tz("Europe/Rome").format(),
                reqId: req.reqId,
                success: false,
                path: req.originalUrl,
                method: req.method,
                status: code,
                fields: fields,
                message: formattedErrors
            }
            authLogger.error(response);
            return res.status(code).json(response);
        } else {
            const response = {
                timestamp: moment.tz("Europe/Rome").format(),
                reqId: req.reqId,
                success: false,
                path: req.originalUrl,
                method: req.method,
                status: code,
                fields: fields,
                message: errors
            }
            authLogger.error(response);
            return res.status(code).json(response);
        }

    }

    // Mongoose Duplicate key error
    //handle email or usename duplicates

    if(err.code && err.code === 11000){

        const field = Object.keys(err.keyValue);
        const response ={
            timestamp: moment.tz("Europe/Rome").format(),
            reqId: req.reqId,
            success: false,
            path: req.originalUrl,
            method: req.method,
            status: 409,
            message: `An account with that ${field} already exists.`,
            stack: process.env.NODE_ENV === 'development' ? err.stack : {}

        }
        authLogger.error(response);
        return res.status(409).json(response)
    }

    const errStatus = err.statusCode || 500;
    const errMsg = err.message || 'Something went wrong';

    const response = {
        timestamp: moment.tz("Europe/Rome").format(),
        reqId: req.reqId,
        success: false,
        path: req.originalUrl,
        method: req.method,
        status: errStatus,
        message: errMsg,
        stack: process.env.NODE_ENV === 'development' ? err.stack : {}
    }

    genericLogger.error(response);

    return res.status(errStatus).json(response)

};


module.exports = errorHandler;




