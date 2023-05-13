const express = require('express');

const {
  createMenu,
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

module.exports = router;
