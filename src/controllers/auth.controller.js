const bcryptjs = require('bcryptjs');
const { check, validationResult } = require('express-validator');
const moment = require('moment/moment');
const successResponse = require('../../utils/successResponse');
const { authLogger } = require('../../utils/logger');
// const env = process.env.NODE_ENV || "prod";

const { User } = require('../models/User.model');
const { generateRandomId } = require('../../utils/generateRandomId');

const ErrorResponse = require('../../utils/errorResponse');

// Get token from model, craete cookie and send response
const sendTokenResponse = (req, res, user, customMessage) => {
  // Create token
  const token = user.getSignedJwtToken();
  const customData = {
    token,
    expires: '2h',
    httpOnly: true,
  };

  if (process.env.NODE_ENV === 'production') {
    customData.secure = true;
  }

  successResponse(req, res, 200, customMessage || null, customData);
};

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
  req.body.loginData.isActive = 0;
  req.reqId = generateRandomId();
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  const { password } = req.body.loginData;

  // encrypt password
  const salt = await bcryptjs.genSalt(10);
  req.body.loginData.password = await bcryptjs.hash(password, salt);

  await User.create(req.body).then((user) => {
    // Generate JWT token
    sendTokenResponse(req, res, user, 'User Registered');
  }, (error) => {
    next(error);
    // res.status(500).json(error);
  });
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
  req.reqId = generateRandomId();
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  const { email } = req.body;
  const { password } = req.body;

  await User.findOne({ email }).then(async (user) => {
    // user exists
    const bodyError = {
      timestamp: moment.tz('Europe/Rome').format(),
      reqId: req.reqId,
      method: req.method,
      path: req.originalUrl,
      status: 401,
      message: 'User or password incorrect. Please try again',
    };
    if (user) {
      if (await bcryptjs.compare(password, user.loginData.password)) {
        // Generate JWT token
        // eslint-disable-next-line no-underscore-dangle
        console.log(`User logged:${user._id}`);
        sendTokenResponse(req, res, user, 'User logged in');
      } else {
        authLogger.error(bodyError);
        res.status(401).json(bodyError);
      }
    } else {
      authLogger.error(bodyError);
      res.status(401).json(bodyError);
    }
  }, (error) => {
    // user not exists
    next(error);
    // res.status(500).json(error);
  });
});

/**
 * @param req
 * @param res
 * @description     Log user out / clear cookie
 * @route           GET auth/logout
 * @access          Private
 */
exports.logout = async (req, res) => {
  req.reqId = generateRandomId();
  res.cookie('token', 'none', {
    expires: new Date(Date.now() + 10 * 1000),
    httpOnly: true,
  });
  successResponse(req, res, null, 'User logged out', null);
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
  // retrieve user from req
  const { user } = req;

  req.reqId = generateRandomId();
  // eslint-disable-next-line no-underscore-dangle
  User.findById(user._id).then((userData) => {
    successResponse(req, res, null, 'User correctly retrieved', userData);
  }, (error) => {
    next(error);
  });
};

/**
 * @param req
 * @param res
 * @param next
 * @description     Update password
 * @route           PUT /auth/updatepassword
 * @access          Private
 */
exports.updatePassword = async (req, res, next) => {
  req.reqId = generateRandomId();

  // get user password from logged user (field in request)
  // eslint-disable-next-line no-underscore-dangle
  const user = await User.findById(req.user._id).select('loginData.password');

  const { currentPassword, newPassword } = req.body;
  // Check current password
  if (!(await user.matchPassword(currentPassword))) {
    return next(new ErrorResponse('Password is incorrect', 401));
  }

  const currPass = await user.encryptPassword(newPassword);
  await User.findByIdAndUpdate(
    // eslint-disable-next-line no-underscore-dangle
    { _id: user._id },
    { $set: { 'loginData.password': currPass } },
    { new: true },
  ).then(() => {
    sendTokenResponse(req, res, user);
  }, (error) => {
    next(error);
  });
};
