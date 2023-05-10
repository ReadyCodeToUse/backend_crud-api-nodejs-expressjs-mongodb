const { generateRandomReqId } = require('../../utils/reqId');
const { Activity } = require('../models/Activity.model');

const successResponse = require('../../utils/successResponse');
const { ActivityStatus } = require('../../utils/enums/activity.enum');

/**
 * @param req
 * @param res
 * @param next
 * @description     Get All Activities for current user
 * @route           GET /activity/all
 * @access          Private
 */
exports.getAllActivities = async (req, res, next) => {
  req.reqId = generateRandomReqId();
  // retrieve user from request
  const { user } = req;
  // eslint-disable-next-line no-underscore-dangle
  await Activity.find({
    // eslint-disable-next-line no-underscore-dangle
    user_id: user._id,
  }).then((activity) => {
    if (activity.length > 0) {
      successResponse(req, res, null, 'All activities retrieved', activity, false);
    } else {
      successResponse(req, res, 404, 'The user has no activities', {});
    }
  }, (error) => {
    next(error);
  });
};

/**
 * @param req
 * @param res
 * @param next
 * @description     Get Single Activity for current user
 * @route           GET /activity/:activityId
 * @access          Private
 */
exports.getSingleActivity = async (req, res, next) => {
  req.reqId = generateRandomReqId();
  // retrieve user from request
  const { user } = req;
  const { activityId } = req.params;

  await Activity.find({
    // eslint-disable-next-line no-underscore-dangle
    user_id: user._id,
    _id: activityId,
  }).then((activity) => {
    if (activity.length > 0) {
      successResponse(req, res, null, 'Single Activity retrieved', activity);
    } else {
      successResponse(req, res, 404, 'Activity not found', activity);
    }
  }, (error) => {
    next(error);
  });
};

/**
 * @param req
 * @param res
 * @param next
 * @description     Create Activity
 * @route           POST /activity/create
 * @access          Private
 */
// eslint-disable-next-line consistent-return
exports.createActivity = async (req, res, next) => {
  const { user } = req;
  // eslint-disable-next-line no-underscore-dangle
  req.body.user_id = user._id;
  req.body.status = ActivityStatus.ACTIVE;
  req.reqId = generateRandomReqId();
  await Activity.create(req.body).then((activity) => {
    successResponse(req, res, null, 'Activity created', activity, '');
  }, (error) => {
    next(error);
  });
};
