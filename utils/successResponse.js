const moment = require('moment');
const successResponse = (req, res, customStatus, customMessage, customData) => {

    res.status(customStatus === null ? res.statusCode : customStatus).json({
        timestamp: moment.tz("Europe/Rome").format(),
        method: req.method,
        path: req.originalUrl,
        status: customStatus === null ? res.statusCode : customStatus,
        message: customMessage === null ? res.message : customMessage,
        data: customData === null ? {} : customData
    })
}
module.exports = successResponse;