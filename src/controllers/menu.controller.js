const { validationResult } = require('express-validator');
const { generateRandomReqId } = require('../../utils/reqId');
const { Activity } = require('../models/Activity.model');
const successResponse = require('../../utils/successResponse');
const { Menu } = require('../models/Menu.model');
/**
 * @param req
 * @param res
 * @param next
 * @description     Create Menu
 * @route           POST /menu/:activityId/create
 * @access          Private
 */
// eslint-disable-next-line consistent-return
exports.createMenu = async (req, res, next) => {
  const { user } = req;
  const { activityId } = req.params;
  req.body.activity_id = activityId;
  // eslint-disable-next-line no-underscore-dangle
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  req.reqId = generateRandomReqId();

  await Menu.create(req.body).then(async (menu) => {
    // eslint-disable-next-line no-underscore-dangle
    // req.body._id = menu._id;
    // eslint-disable-next-line no-underscore-dangle,max-len
    await Activity.findByIdAndUpdate({ _id: activityId, user: user._id }, { $push: { menus: menu } }).then(() => {
      // eslint-disable-next-line no-console
      successResponse(req, res, null, 'Menu created', menu);
    }, (error) => {
      next(error);
    });
  }, (error) => {
    next(error);
  });
};

/**
 * @param req
 * @param res
 * @param next
 * @description     Delete Menu
 * @route           DELETE /menu/:activityId/delete/:menuId
 * @access          Private
 */
exports.deleteMenu = async (req, res, next) => {
  const { user } = req;
  const { activityId, menuId } = req.params;
  req.reqId = generateRandomReqId();
  await Menu.findByIdAndDelete({ _id: menuId, activity_id: activityId }).then(async (menu) => {
    // eslint-disable-next-line max-len
    await Activity.findByIdAndUpdate({ _id: activityId, user: user._id }, { $pull: { menus: menu } }).then(() => {
      successResponse(req, res, null, 'Menu deleted', menu);
    }, (error) => {
      next(error);
    });
  }, (error) => {
    next(error);
  });
};
