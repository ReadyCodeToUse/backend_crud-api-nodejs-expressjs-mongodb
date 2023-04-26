const moment = require('moment');
const { authLogger } = require('./logger');

const successResponse = (req, res, customStatus, customMessage, customData, createLog) => {
  if (createLog === undefined) {
    // eslint-disable-next-line no-param-reassign
    createLog = true;
  }
  const response = {
    timestamp: moment.tz('Europe/Rome').format(),
    reqId: req.reqId,
    method: req.method,
    path: req.originalUrl,
    status: customStatus === null ? res.statusCode : customStatus,
    message: customMessage === null ? res.message : customMessage,
    data: customData === null ? {} : customData,
  };

  const responseForLog = {
    timestamp: moment.tz('Europe/Rome').format(),
    reqId: req.reqId,
    method: req.method,
    path: req.originalUrl,
    status: customStatus === null ? res.statusCode : customStatus,
    message: customMessage === null ? res.message : customMessage,
    data: customData === null || !createLog ? {} : customData,
  };

  authLogger.info(responseForLog);

  if (customData !== null && customData.token) {
    res.status(customStatus === null ? res.statusCode : customStatus).cookie('token', customData.token, customData.expires).json(response);
  } else {
    res.status(customStatus === null ? res.statusCode : customStatus).json(response);
  }
};
module.exports = successResponse;
