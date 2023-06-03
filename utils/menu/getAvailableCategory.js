const { Menu } = require('../../src/models/Menu.model');

const getAvailableCategory = async (activtyId, menuId, userId, next) => {
  const response = await Menu.findOne({
    _id: menuId,
    user_id: userId,
    activity_id: activtyId,
  }, {
    itemCustomCategoryList: 1,
    // eslint-disable-next-line consistent-return
  }).then((menu) => {
    // eslint-disable-next-line array-callback-return

    const itemCustomCategoryListValue = menu.itemCustomCategoryList.map((item) => item.category);
    return itemCustomCategoryListValue;
  }, (error) => {
    next(error);
  });
  return response;
};

module.exports = getAvailableCategory;
