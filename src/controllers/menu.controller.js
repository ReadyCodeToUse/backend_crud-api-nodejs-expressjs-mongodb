const { validationResult } = require('express-validator');
const {
  S3Client,
  PutObjectCommand,
// eslint-disable-next-line import/no-extraneous-dependencies
} = require('@aws-sdk/client-s3');

const { generateRandomId } = require('../../utils/generateRandomId');
const { Activity } = require('../models/Activity.model');
const successResponse = require('../../utils/successResponse');
const { Menu } = require('../models/Menu.model');
const getAvailableCategory = require('../../utils/menu/getAvailableCategory');

const s3Config = {
  accessKeyId: process.env.AWS_ACCESS_KEY,
  secretAccessKey: process.env.AWS_ACCESS_SECRET,
  region: 'us-east-1',
};

const s3Client = new S3Client(s3Config);

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
  req.reqId = generateRandomId();

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
  req.reqId = generateRandomId();
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
  req.reqId = generateRandomId();
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
  req.reqId = generateRandomId();
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
  req.reqId = generateRandomId();

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
  req.reqId = generateRandomId();

  if (req.body.category) {
    const itemCustomCategoryList = await getAvailableCategory(activityId, menuId, user._id, next);

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
  req.reqId = generateRandomId();
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
  req.reqId = generateRandomId();

  if (req.body.category) {
    const itemCustomCategoryList = await getAvailableCategory(activityId, menuId, user._id, next);
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

/**
 * @param req
 * @param res
 * @param next
 * @description     Upload Menu File
 * @route           POST /menu/:activityId/upload/:menuId/
 * @access          Private
 */
exports.uploadMenuFile = async (req, res, next) => {
  const { user } = req;
  const { activityId, menuId } = req.params;
  req.reqId = generateRandomId();

  await Menu.find({
    _id: menuId,
    user_id: user._id,
    activity_id: activityId,
  }, { _id: 1 }).then(async (response) => {
    // menu and activity exists
    if (response.length > 0) {
      const uniqueMenuId = generateRandomId();

      const file = req.files;
      const fileType = req.files.files.mimetype;
      const fileName = `${process.env.AWS_S3_BUCKET_SUBFOLDER + uniqueMenuId}.pdf`;

      if (fileType !== 'application/pdf') {
        return successResponse(req, res, 400, 'Only pdf file is allowed', {});
      }

      const bucketParams = {
        Bucket: process.env.AWS_S3_BUCKET_NAME,
        Key: fileName,
        Body: file.files.data,
        ContentType: 'application/pdf',
        ContentDisposition: 'inline',
      };
      try {
        await s3Client.send(new PutObjectCommand(bucketParams)).then((awsResponse) => {
          if (awsResponse.$metadata.httpStatusCode === 200) {
            Menu.findOneAndUpdate({
              _id: menuId,
              user_id: user._id,
              activity_id: activityId,
            }, { $set: { menuUrl: fileName } }, { returnOriginal: false }).then((menu) => {
              if (menu === null) {
                successResponse(req, res, 404, 'Menu not found', {});
              } else {
                successResponse(req, res, null, 'Menu file uploaded', menu);
              }
            }, (error) => {
              next(error);
            });
          } else {
            return successResponse(req, res, 500, 'Internal server error', {});
          }
        });
      } catch (err) {
        return successResponse(req, res, 500, 'Internal server error', {});
      }
    } else {
      return successResponse(req, res, 404, 'Menu not found', {});
    }
  });
};
