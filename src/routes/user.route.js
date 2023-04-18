const express = require('express');
const {
  getAllUsers,
  updateCurrentUserData,
} = require('../controllers/user.controller');

const { protect, authorize } = require('../middleware/auth');

const router = express.Router({ mergeParams: true });

/**
 * @swagger
 * /user/all:
 *   get:
 *     security:
 *       - Authentication: [admin]
 *     summary: Get all users data
 *     tags:
 *       - User
 *     description: Get all users data
 *     parameters:
 *         - in: header
 *           name: x-access-token
 *           required: true
 *           description: JWT access token
 *           schema:
 *             type: string
 *     responses:
 *       200:
 *         description: Success. User data retrieved
 *       400:
 *         description: Login failed
 *
 *
 */
router.route('/all')
  .get(protect, authorize('admin'), getAllUsers);

/**
 * @swagger
 * /user/update:
 *   put:
 *     security:
 *       - Authentication: []
 *     summary: Update Current User
 *     tags:
 *       - User
 *     description: Update current user
 *     parameters:
 *         - in: header
 *           name: x-access-token
 *           required: true
 *           description: JWT access token
 *           schema:
 *             type: string
 *     requestBody:
 *        required: true
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              properties:
 *                firstName:
 *                  type: string
 *                  description: The name of the user
 *                lastName:
 *                  type: string
 *                  description: The last name of the user
 *                birthData:
 *                  type: string
 *                  description: The birthdate of the user (YYYY-MM-DD)
 *                sex:
 *                  type: string
 *                  description: The sex of the user
 *                  enum:
 *                    - M
 *                    - F
 *                    - N
 *                address:
 *                  type: string
 *                  description: The address of the user
 *     responses:
 *       200:
 *         description: Success. Current User updated
 *       400:
 *         description: User not updated
 *
 *
 */
router.route('/update')
  .put(protect, updateCurrentUserData);

module.exports = router;
