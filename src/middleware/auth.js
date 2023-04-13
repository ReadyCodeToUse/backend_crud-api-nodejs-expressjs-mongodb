const jwt = require("jsonwebtoken");
const moment = require("moment");
const {User} = require("../models/User.model");
const asyncHandler = require("./async");
const ErrorResponse = require("../../utils/errorResponse");
const {generateRandomReqId} = require("../../utils/reqId");

const config = process.env;


exports.protect = asyncHandler(async (req, res, next) => {
    const token = req.body.token || req.query.token || req.headers["x-access-token"];
    req.reqId = generateRandomReqId();

    if (!token) {
        const body = {
            timestamp: moment.tz("Europe/Rome").format(),
            reqId: req.reqId,
            path: req.originalUrl,
            method: req.method,
            status: 403,
            message: 'A token is required for authentication'
        }
        return res.status(403).json(body);
        //return res.status(403).send("test");
    }
    try {
        const decoded = jwt.verify(token, config.TOKEN_KEY);
        req.user = await User.findById(decoded._id);

    } catch (err) {
        const body = {
            timestamp: moment.tz("Europe/Rome").format(),
            reqId: req.reqId,
            path: req.originalUrl,
            method: req.method,
            status: 401,
            message: 'Invalid user token.'
        }
        return res.status(401).json(body);
    }
    return next();

});

// Grant access to specific roles
exports.authorize = (...roles) => {
    return (req, res, next) => {
        if (!roles.includes(req.user.loginData.role)) {
            return next(
                new ErrorResponse(
                    `User role <${req.user.loginData.role}> is not authorized to access this route`,
                    403
                )
            );
        }
        next();
    };
};