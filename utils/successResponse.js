const moment = require('moment');
const {genericLogger} = require("./logger");
const successResponse = (req, res, customStatus, customMessage, customData) => {

    const response = {
        timestamp: moment.tz("Europe/Rome").format(),
        method: req.method,
        path: req.originalUrl,
        status: customStatus === null ? res.statusCode : customStatus,
        message: customMessage === null ? res.message : customMessage,
        data: customData === null ? {} : customData
    }

    res.status(customStatus === null ? res.statusCode : customStatus).json(response);
}
module.exports = successResponse;