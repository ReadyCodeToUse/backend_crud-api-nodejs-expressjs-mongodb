// const { check, validationResult } = require('express-validator');
const successResponse = require('../../utils/successResponse');

// const env = process.env.NODE_ENV || "prod";

const { User } = require('../models/User.model');
const { generateRandomId } = require('../../utils/generateRandomId');

/**
 * @param req
 * @param res
 * @param next
 * @description     Register User
 * @route           POST /auth/register
 * @access          Public
 */
exports.getAllUsers = async (req, res, next) => {
  req.reqId = generateRandomId();
  await User.find().then((user) => {
    if (user) {
      successResponse(req, res, null, 'Users retrieved', user, false);
    } else {
      successResponse(req, res, null, 'No user found', {});
    }
  }, (error) => {
    next(error);
  });
};

/**
 * @param req
 * @param res
 * @param next
 * @description     Update Current User
 * @route           POST /user/update
 * @access          Private
 */
exports.updateCurrentUserData = async (req, res, next) => {
  // sanitize field schema to prevent undesirable field update (like password..)
  const fieldToUpdate = {
    firstName: req.body.firstName,
    lastName: req.body.lastName,
    birthData: req.body.birthData,
    sex: req.body.sex,
    email: req.body.email,
    address: req.body.address,
  };

  req.reqId = generateRandomId();

  // eslint-disable-next-line no-underscore-dangle
  const userId = req.user._id.toString();
  User.findByIdAndUpdate({
    _id: userId,
  }, fieldToUpdate, { new: true }).then((user) => {
    successResponse(req, res, null, 'User edited correctly', user);
  }, (error) => {
    next(error);
  });
};
