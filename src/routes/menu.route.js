const express = require('express');

const {
  createMenu,
  deleteMenu,
  getAllMenus,
  getSingleMenu,
  updateMenu,
  updateSingleMenuItem,
  deleteSingleMenuItem,
} = require('../controllers/menu.controller');

const { protect } = require('../middleware/auth');

const router = express.Router({ mergeParams: true });

/**
 * @swagger
 * /menu/:activityId/create:
 *   post:
 *     security:
 *       - Authentication: []
 *     summary: Create new Menu for current activity
 *     tags:
 *       - Menu
 *     description: Create new Menu for current activity
 *     parameters:
 *         - in: header
 *           name: x-access-token
 *           required: true
 *           description: JWT access token
 *           schema:
 *             type: string
 *     requestBody:
 *         required: true
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 name:
 *                   type: string
 *                   description: The name of the menu
 *                 description:
 *                   type: string
 *                   description: The description of the menu
 *                 itemCustomCategoryList:
 *                   type: array
 *                   description: The list of custom category for menu item
 *                   items:
 *                      type: object
 *                      properties:
 *                        category:
 *                          type: string
 *                          description: The category of the custom category
 *                 isDynamic:
 *                    type: boolean
 *                    description: Check true if domain is dynamic and can change
 *                 show:
 *                    type: boolean
 *                    description: Check if show the menu
 *                 items:
 *                   type: array
 *                   description: The list of item for menu
 *                   items:
 *                     type: object
 *                     properties:
 *                       itemName:
 *                         type: string
 *                         description: The name of the item
 *                       itemDescription:
 *                         type: string
 *                         description: The description of the item
 *                       itemImage:
 *                          type: string
 *                          description: The image of the item
 *                       itemPrice:
 *                         type: string
 *                         description: The price of the item
 *                       category:
 *                         type: string
 *                         description: The category of the item
 *                       show:
 *                          type: boolean
 *                          description: The show of the item
 *               required:
 *                 - name
 *                 - isDynamic
 *     responses:
 *       200:
 *         description: Success. Menu crated
 *       400:
 *         description: Failed. Some fields not supported
 *       401:
 *         description: Unauthorized. User not logged in
 *       409:
 *         description: Conflict error, data is already present in db
 *
 */
router.route('/:activityId/create')
  .post(protect, createMenu);

/**
 * @swagger
 *  /menu/:activityId/delete/:menuId:
 *   delete:
 *     security:
 *       - Authentication: []
 *     summary: Delete Menu
 *     tags:
 *       - Menu
 *     description: Delete Menu
 *     parameters:
 *         - in: header
 *           name: x-access-token
 *           required: true
 *           description: JWT access token
 *           schema:
 *             type: string
 *         - in: path
 *           name: activityId
 *           required: true
 *           description: The id of the activity
 *           schema:
 *             type: string
 *         - in: path
 *           name: menuId
 *           required: true
 *           description: The id of the menu to delete
 *           schema:
 *             type: string
 *     responses:
 *       200:
 *         description: Success. Menu deleted
 *       401:
 *         description: Unauthorized. User not logged in
 *       404:
 *         description: Failed. Menu not found
 *       500:
 *         description: Can't delete Menu
 *
 */
router.route('/:activityId/delete/:menuId')
  .delete(protect, deleteMenu);

/**
 * @swagger
 *  /menu/:activityId/all:
 *   get:
 *     security:
 *       - Authentication: []
 *     summary: Get all Menus from current activity
 *     tags:
 *       - Menu
 *     description: Get all Menus from current activity
 *     parameters:
 *         - in: header
 *           name: x-access-token
 *           required: true
 *           description: JWT access token
 *           schema:
 *             type: string
 *         - in: path
 *           name: activityId
 *           required: true
 *           description: The id of the activity
 *           schema:
 *             type: string
 *     responses:
 *       200:
 *         description: Success. Menu fetched
 *       401:
 *         description: Unauthorized. User not logged in
 *       404:
 *         description: Failed. Menu not found
 *       500:
 *         description: Can't retrieve menus
 *
 */
router.route('/:activityId/all')
  .get(protect, getAllMenus);

/**
 * @swagger
 *  /menu/:activityId/single/:menuId:
 *   get:
 *     security:
 *       - Authentication: []
 *     summary: Get single Menu from current activity
 *     tags:
 *       - Menu
 *     description: Get single Menu from current activity
 *     parameters:
 *         - in: header
 *           name: x-access-token
 *           required: true
 *           description: JWT access token
 *           schema:
 *             type: string
 *         - in: path
 *           name: activityId
 *           required: true
 *           description: The id of the activity
 *           schema:
 *             type: string
 *         - in: path
 *           name: menuId
 *           required: true
 *           description: The id of the menu
 *           schema:
 *             type: string
 *     responses:
 *       200:
 *         description: Success. Menu fetched
 *       401:
 *         description: Unauthorized. User not logged in
 *       404:
 *         description: Failed. Menu not found
 *       500:
 *         description: Can't retrieve menu
 *
 */
router.route('/:activityId/single/:menuId')
  .get(protect, getSingleMenu);

/**
 * @swagger
 *  /menu/:activityId/update/:menuId:
 *   patch:
 *     security:
 *       - Authentication: []
 *     summary: Update Menu from current activity
 *     tags:
 *       - Menu
 *     description: Update Menu from current activity
 *     parameters:
 *         - in: header
 *           name: x-access-token
 *           required: true
 *           description: JWT access token
 *           schema:
 *             type: string
 *         - in: path
 *           name: activityId
 *           required: true
 *           description: The id of the activity
 *           schema:
 *             type: string
 *         - in: path
 *           name: menuId
 *           required: true
 *           description: The id of the menu
 *           schema:
 *             type: string
 *     requestBody:
 *         required: true
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 name:
 *                   type: string
 *                   description: The name of the menu
 *                   example: "New Menu"
 *                   required: false
 *                 description:
 *                   type: string
 *                   description: The description of the menu
 *                   example: "New Menu Description"
 *                   required: false
 *     responses:
 *       200:
 *         description: Success. Menu fetched
 *       401:
 *         description: Unauthorized. User not logged in
 *       404:
 *         description: Failed. Menu not found
 *       500:
 *         description: Can't retrieve menu
 *
 */
router.route('/:activityId/update/:menuId')
  .patch(protect, updateMenu);

/**
 * @swagger
 *  /menu/:activityId/update/:menuId/item/:itemId:
 *   patch:
 *     security:
 *       - Authentication: []
 *     summary: Update Menu item from current activity
 *     tags:
 *       - Menu
 *     description: Update Menu item from current activity
 *     parameters:
 *         - in: header
 *           name: x-access-token
 *           required: true
 *           description: JWT access token
 *           schema:
 *             type: string
 *         - in: path
 *           name: activityId
 *           required: true
 *           description: The id of the activity
 *           schema:
 *             type: string
 *         - in: path
 *           name: menuId
 *           required: true
 *           description: The id of the menu
 *           schema:
 *             type: string
 *         - in: path
 *           name: itemId
 *           required: true
 *           description: The id of the item
 *           schema:
 *             type: string
 *     requestBody:
 *         required: true
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 itemName:
 *                   type: string
 *                   description: The name of the item
 *                   example: "Item name"
 *                   required: false
 *                 itemDescription:
 *                   type: string
 *                   description: The description of the item
 *                   example: "New item Description"
 *                   required: false
 *                 itemImage:
 *                   type: string
 *                   description: The image of the item
 *                   example: "https://www.google.com/image.png"
 *                   required: false
 *                 category:
 *                   type: string
 *                   description: The category of the item
 *                   example: "primo"
 *                   required: false
 *                 itemPrice:
 *                   type: string
 *                   description: The price of the item
 *                   example: "10"
 *                   required: false
 *     responses:
 *       200:
 *         description: Success. Menu item updated
 *       401:
 *         description: Unauthorized. User not logged in
 *       404:
 *         description: Failed. Item not found
 *       500:
 *         description: Can't retrieve item
 *
 */
router.route('/:activityId/update/:menuId/item/:itemId')
  .patch(protect, updateSingleMenuItem);

/**
 * @swagger
 *  /menu/:activityId/delete/:menuId/item/:itemId:
 *   delete:
 *     security:
 *       - Authentication: []
 *     summary: Delete Menu item from current activity
 *     tags:
 *       - Menu
 *     description: Delete Menu item from current activity
 *     parameters:
 *         - in: header
 *           name: x-access-token
 *           required: true
 *           description: JWT access token
 *           schema:
 *             type: string
 *         - in: path
 *           name: activityId
 *           required: true
 *           description: The id of the activity
 *           schema:
 *             type: string
 *         - in: path
 *           name: menuId
 *           required: true
 *           description: The id of the menu
 *           schema:
 *             type: string
 *         - in: path
 *           name: itemId
 *           required: true
 *           description: The id of the item
 *           schema:
 *             type: string
 *     responses:
 *       200:
 *         description: Success. Menu item deleted
 *       401:
 *         description: Unauthorized. User not logged in
 *       404:
 *         description: Failed. Menu Item not found
 *       500:
 *         description: Can't retrieve item
 *
 */
router.route('/:activityId/delete/:menuId/item/:itemId')
  .delete(protect, deleteSingleMenuItem);

module.exports = router;
