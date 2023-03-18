const jwt = require("jsonwebtoken");
const moment = require("moment");

const config = process.env;

const verifyToken = (req, res, next) => {
    const token =
        req.body.token || req.query.token || req.headers["x-access-token"];

    if (!token) {

        const body = {
            Timestamp: moment.tz("Europe/Rome").format(),
            Path: req.originalUrl,
            Method: req.method,
            Status: 403,
            Message: 'A token is required for authentication'
        }
        return res.status(403).json(body);
        //return res.status(403).send("test");
    }
    try {
        req.user = jwt.verify(token, config.TOKEN_KEY);
    } catch (err) {
        return res.status(401).send("Invalid Token");
    }
    return next();
};

module.exports = verifyToken;