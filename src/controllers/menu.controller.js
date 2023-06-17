const { validationResult } = require('express-validator');
const { generateRandomReqId } = require('../../utils/reqId');
const { Activity } = require('../models/Activity.model');
const successResponse = require('../../utils/successResponse');
const { Menu } = require('../models/Menu.model');
const getAvailableCategory = require('../../utils/menu/getAvailableCategory');
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
  req.body.user_id = user._id;
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
    await Activity.findOneAndUpdate({ _id: activityId, user_id: user._id }, { $push: { menus: menu } }).then((activity) => {
      // eslint-disable-next-line no-console
      if (activity === null) {
        successResponse(req, res, 404, 'Activity not found, menu not created', menu);
      } else {
        successResponse(req, res, null, 'Menu created', menu);
      }
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
  await Menu.findOneAndDelete({
    _id: menuId,
    activity_id: activityId,
    user_id: user._id,
  }).then(async (menu) => {
    if (menu === null) {
      successResponse(req, res, 404, 'Menu not found', {});
    } else {
      await Activity.findByIdAndUpdate({
        _id: activityId,
        user: user._id,
      }, { $pull: { menus: menu } }).then(() => {
        successResponse(req, res, null, 'Menu deleted', menu);
      }, (error) => {
        next(error);
      });
    }
  }, (error) => {
    next(error);
  });
};

/**
 * @param req
 * @param res
 * @param next
 * @description     Get all Menus from activity
 * @route           GET /menu/:activityId/all
 * @access          Private
 */
exports.getAllMenus = async (req, res, next) => {
  const { user } = req;
  const { activityId } = req.params;
  req.reqId = generateRandomReqId();
  await Menu.find({
    activity_id: activityId,
    user_id: user._id,
  }).then((menus) => {
    successResponse(req, res, null, 'Menus fetched', menus);
  }, (error) => {
    next(error);
  });
};

/**
 * @param req
 * @param res
 * @param next
 * @description     Get Single Menu by id
 * @route           GET /menu/:activityId/single/:menuId
 * @access          Private
 */
exports.getSingleMenu = async (req, res, next) => {
  const { user } = req;
  const { activityId, menuId } = req.params;
  req.reqId = generateRandomReqId();
  await Menu.find({
    _id: menuId,
    activity_id: activityId,
    user_id: user._id,
  }).then((menu) => {
    if (menu === null || menu.length === 0) {
      successResponse(req, res, 404, 'Menu not found', {});
    } else {
      successResponse(req, res, null, 'Menu fetched', menu);
    }
  }, (error) => {
    next(error);
  });
};

/**
 * @param req
 * @param res
 * @param next
 * @description     Update Menu Data
 * @route           PUT /menu/:activityId/update/:menuId
 * @access          Private
 */
exports.updateMenu = async (req, res, next) => {
  const { user } = req;
  const { activityId, menuId } = req.params;
  req.reqId = generateRandomReqId();

  const fieldsToUpdate = {
    name: req.body.name,
    description: req.body.description,
  };
  await Menu.findOneAndUpdate({
    _id: menuId,
    user_id: user._id,
  }, fieldsToUpdate, { new: true }).then(async (menu) => {
    if (menu === null) {
      successResponse(req, res, 404, 'Menu not found', {});
    } else {
      await Activity.findOneAndUpdate({
        _id: activityId,
        user_id: user._id,
      }, { $set: { menus: menu } }).then(() => {
        successResponse(req, res, null, 'Menu updated', menu);
      }, (error) => {
        next(error);
      });
    }
  }, (error) => {
    next(error);
  });
};

/**
 * @param req
 * @param res
 * @param next
 * @description     Edit Single Menu item
 * @route           PUT /menu/:activityId/update/:menuId/item/:itemId
 * @access          Private
 */
// eslint-disable-next-line consistent-return
exports.updateSingleMenuItem = async (req, res, next) => {
  const { user } = req;
  const { activityId, menuId, itemId } = req.params;
  req.reqId = generateRandomReqId();

  if (req.body.category) {
    const itemCustomCategoryList = await getAvailableCategory(activityId, menuId, user._id, next);
    console.log(itemCustomCategoryList);

    if (!itemCustomCategoryList.includes(req.body.category)) {
      return successResponse(req, res, 404, `Category not available for this Activity . Please choose from ${itemCustomCategoryList}`, {});
    }
  }

  const fieldsToUpdate = {
    itemName: req.body.itemName,
    itemDescription: req.body.itemDescription,
    itemImage: req.body.itemImage,
    category: req.body.category,
    itemPrice: req.body.itemPrice,
  };
  await Menu.findOneAndUpdate(
    {
      _id: menuId,
      user_id: user._id,
      activity_id: activityId,
      items: { $elemMatch: { _id: itemId } },
    },
    {
      $set: {
        'items.$.itemName': fieldsToUpdate.itemName,
        'items.$.itemDescription': fieldsToUpdate.itemDescription,
        'items.$.itemImage': fieldsToUpdate.itemImage,
        'items.$.category': fieldsToUpdate.category,
        'items.$.itemPrice': fieldsToUpdate.itemPrice,
      },
    },
    {
      // arrayFilters: [{ 'item._id': itemId }],
      returnOriginal: false,
    },
  ).then(async (menu) => {
    successResponse(req, res, null, 'Menu item updated', menu);
  }, (error) => {
    next(error);
  });
};

/**
 * @param req
 * @param res
 * @param next
 * @description     Delete Single Menu item
 * @route           DELETE /menu/:activityId/delete/:menuId/item/:itemId
 * @access          Private
 */
exports.deleteSingleMenuItem = async (req, res, next) => {
  const { user } = req;
  const { activityId, menuId, itemId } = req.params;
  req.reqId = generateRandomReqId();
  await Menu.findOneAndUpdate(
    {
      _id: menuId,
      user_id: user._id,
      activity_id: activityId,
      items: { $elemMatch: { _id: itemId } },
    },
    { $pull: { items: { _id: itemId } } },
    { returnOriginal: false },
  ).then(async (menu) => {
    if (menu === null) {
      successResponse(req, res, 404, 'Menu item not found', {});
    } else {
      successResponse(req, res, null, 'Menu item deleted', menu);
    }
  }, (error) => {
    next(error);
  });
};

/**
 * @param req
 * @param res
 * @param next
 * @description     Create Single Menu item
 * @route           POST /menu/:activityId/create/:menuId/item
 * @access          Private
 */
exports.createSingleMenuItem = async (req, res, next) => {
  const { user } = req;
  const { activityId, menuId } = req.params;
  req.reqId = generateRandomReqId();

  if (req.body.category) {
    const itemCustomCategoryList = await getAvailableCategory(activityId, menuId, user._id, next);
    console.log(itemCustomCategoryList);

    if (!itemCustomCategoryList.includes(req.body.category)) {
      return successResponse(req, res, 404, `Category not available for this Activity . Please choose from ${itemCustomCategoryList}`, {});
    }
  }

  const fieldsToUpdate = {
    itemName: req.body.itemName,
    itemDescription: req.body.itemDescription,
    itemImage: req.body.itemImage,
    category: req.body.category,
    itemPrice: req.body.itemPrice,
  };
  await Menu.findOneAndUpdate(
    {
      _id: menuId,
      user_id: user._id,
      activity_id: activityId,
    },
    { $push: { items: fieldsToUpdate } },
    { returnOriginal: false },
  ).then(async (menu) => {
    if (menu === null) {
      successResponse(req, res, 404, 'Menu item not found', {});
    } else {
      successResponse(req, res, null, 'Menu item created', menu);
    }
  }, (error) => {
    next(error);
  });
};
