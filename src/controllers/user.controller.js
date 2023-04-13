const {check, validationResult} = require("express-validator");
const successResponse = require('../../utils/successResponse');

//const env = process.env.NODE_ENV || "prod";

const {User} = require('../models/User.model');
const errorHandler = require("../middleware/errorHandler");
const {generateRandomReqId} = require("../../utils/reqId");
const {error, info} = require("winston");

/**
 * @param req
 * @param res
 * @param next
 * @description     Register User
 * @route           POST /auth/register
 * @access          Public
 */
exports.getAllUsers = async (req, res, next) => {

    req.reqId = generateRandomReqId();
    User.find().then(user => {
        if (user) {
            successResponse(req, res, null, null, user);
        } else {
            successResponse(req, res, null, "No user found", {});
        }
    }, error => {
        next(error);
    })
};

/**
 * @param req
 * @param res
 * @param next
 * @description     Update Current User
 * @route           POST /user/update
 * @access          Private
 */
exports.updateCurrentUser = async (req, res, next) => {
    req.reqId = generateRandomReqId();
    const userId = req.user._id.toString();
    User.findByIdAndUpdate({
        _id: userId
    }, req.body, {new: true}).then((user) => {
        successResponse(req, res, null, 'User edited correctly', user)
    }, error => {
        next(error);
    });
};
