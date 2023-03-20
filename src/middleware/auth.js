const jwt = require("jsonwebtoken");
const moment = require("moment");

const config = process.env;

const verifyToken = (req, res, next) => {
    const token =
        req.body.token || req.query.token || req.headers["x-access-token"];

    if (!token) {

        const body = {
            timestamp: moment.tz("Europe/Rome").format(),
            path: req.originalUrl,
            method: req.method,
            status: 403,
            message: 'A token is required for authentication'
        }
        return res.status(403).json(body);
        //return res.status(403).send("test");
    }
    try {
        req.user = jwt.verify(token, config.TOKEN_KEY);
    } catch (err) {
        const body = {
            timestamp: moment.tz("Europe/Rome").format(),
            path: req.originalUrl,
            method: req.method,
            status: 401,
            message: 'Invalid user token.'
        }
        return res.status(401).json(body);
    }
    return next();
};

module.exports = verifyToken;