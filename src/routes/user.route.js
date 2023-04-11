const express = require('express');
const {
    getAllUsers,
    updateCurrentUser
} = require('../controllers/user.controller');

const {protect, authorize} = require("../middleware/auth");

const router = express.Router({mergeParams: true});


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
    .get(protect,authorize('admin'), getAllUsers)





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
 *     responses:
 *       200:
 *         description: Success. Current User updated
 *       400:
 *         description: User not updated
 *
 *
 */
router.route('/update')
    .put(protect,updateCurrentUser)

module.exports = router;