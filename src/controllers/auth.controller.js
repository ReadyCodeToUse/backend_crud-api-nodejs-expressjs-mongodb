const bcryptjs = require('bcryptjs');
const crypto = require("crypto");
const {check, validationResult} = require("express-validator");
const jwt = require("jsonwebtoken");
const successResponse = require('../../utils/successResponse');
const {authLogger} = require('../../utils/logger');
//const env = process.env.NODE_ENV || "prod";

const {User} = require('../models/User.model');
const moment = require("moment/moment");
const {error} = require("winston");
const {generateRandomReqId} = require('../../utils/reqId');


const httpContext = require('express-http-context');


/**
 * @param req
 * @param res
 * @param next
 * @description     Register User
 * @route           POST /auth/register
 * @access          Public
 */
exports.registerUser = (async (req, res, next) => {
    const errors = validationResult(req);
    req.reqId = generateRandomReqId();
    if (!errors.isEmpty()) {
        return res.status(400).json({errors: errors.array()});
    }
    let email = req.body.email;
    let password = req.body.loginData.password;

    //encrypt password
    const salt = await bcryptjs.genSalt(10);
    req.body.loginData.password = await bcryptjs.hash(password, salt);
    const randomUserId = crypto.randomBytes(8).toString('hex');

    // Generate JWT token
    const token = jwt.sign(
        {randomUserId, email},
        process.env.TOKEN_KEY,
        {
            expiresIn: "2h",
        }
    );
    await User.create(req.body
    ).then(() => {
        const customData = {
            token: token,
            expiresIn: '2h'
        }
        successResponse(req, res, null, 'User registered', customData);
    }, error => {
        next(error);
        //res.status(500).json(error);
    })
});


/**
 * @param req
 * @param res
 * @param next
 * @description     Login User
 * @route           POST /auth/login
 * @access          Public
 */
exports.loginUser = ([
    check('email', 'Email is required').notEmpty(),
    check('password', 'Password is required').notEmpty(),
], async (req, res, next) => {
    req.reqId = generateRandomReqId();
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({errors: errors.array()});
    }
    let email = req.body.email;
    let password = req.body.password;

    await User.findOne({email: email}).then(async user => {
        //user exists
        const bodyError = {
            timestamp: moment.tz("Europe/Rome").format(),
            reqId: req.reqId,
            method: req.method,
            path: req.originalUrl,
            status: 401,
            message: 'User or password incorrect. Please try again',
        }
        if (user) {
            if (await bcryptjs.compare(password, user.loginData.password)) {
                // Generate JWT token
                console.log("User logged:" + user._id);
                const token = jwt.sign(
                    {_id: user._id, email: user.email},
                    process.env.TOKEN_KEY,
                    {
                        expiresIn: "2h",
                    }
                );

                const customData = {
                    token: token,
                    expiresIn: '2h'
                }
                successResponse(req, res, null, 'User logged in', customData)
                //res.json(body);

            } else {
                authLogger.error(bodyError);
                res.status(401).json(bodyError);
            }
        } else {
            authLogger.error(bodyError);
            res.status(401).json(bodyError);
        }


    }, error => {
        //user not exists
        next(error);
        //res.status(500).json(error);
    })
});


/**
 * @param req
 * @param res
 * @param next
 * @description     Log user out / clear cookie
 * @route           GET auth/logout
 * @access          Private
 */
exports.logout = async (req, res, next) => {

    req.reqId = generateRandomReqId();
    res.cookie('token', 'none', {
        expires: new Date(Date.now() + 10 * 1000),
        httpOnly: true
    })
    successResponse(req, res, null, 'User logged out', null)
};


/**
 * @param req
 * @param res
 * @param next
 * @description     Get Current Logged User
 * @route           GET /auth/me
 * @access          Private
 */
exports.getMe = async (req, res, next) => {

    // retrieve user from request
    const user = req.user;

    req.reqId = generateRandomReqId();
    User.findById(user._id).then((userData) => {
        successResponse(req, res, null, 'User correctly retrieved', userData);
    }, error => {
        next(error);
    });
};