const moment = require("moment/moment");
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
            return res.status(code).json({
                timestamp: moment.tz("Europe/Rome").format(),
                success: false,
                path: req.originalUrl,
                method: req.method,
                status: res.statusCode,
                fields: fields,
                message: formattedErrors
            });
        } else {
            return res.status(code).json({
                timestamp: moment.tz("Europe/Rome").format(),
                success: false,
                path: req.originalUrl,
                method: req.method,
                status: res.statusCode,
                message: errors,
                fields: fields
            })
        }

    }

    // Mongoose Duplicate key error
    //handle email or usename duplicates

    if(err.code && err.code === 11000){

        const field = Object.keys(err.keyValue);
        return res.status(409).json({
            timestamp: moment.tz("Europe/Rome").format(),
            success: false,
            path: req.originalUrl,
            method: req.method,
            status: res.statusCode,
            message: `An account with that ${field} already exists.`,
            stack: process.env.NODE_ENV === 'development' ? err.stack : {}

        })
    }

    const errStatus = err.statusCode || 500;
    console.log("statusCode: " +err.statusCode);
    const errMsg = err.message || 'Something went wrong';
    return res.status(errStatus).json({
        timestamp: moment.tz("Europe/Rome").format(),
        success: false,
        path: req.originalUrl,
        method: req.method,
        status: res.statusCode,
        message: errMsg,
        stack: process.env.NODE_ENV === 'development' ? err.stack : {}
    })

};


module.exports = errorHandler;




