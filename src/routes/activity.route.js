const express = require('express');

const {
  getAllActivities,
  getSingleActivity,
  createActivity,
} = require('../controllers/activity.controller');

const { protect } = require('../middleware/auth');

const router = express.Router({ mergeParams: true });

/**
 * @swagger
 * /activity/all:
 *   get:
 *     security:
 *       - Authentication: []
 *     summary: Get all activities for the current user
 *     tags:
 *       - Activity
 *     description: Get all activities for the current user
 *     parameters:
 *         - in: header
 *           name: x-access-token
 *           required: true
 *           description: JWT access token
 *           schema:
 *             type: string
 *     responses:
 *       200:
 *         description: Success. All activities for the current user retrieved
 *       401:
 *         description: Unauthorized. User not logged in
 *       404:
 *         description: Failed. Activities not found
 *       500:
 *         description: Can't retrieve Activities
 *
 *
 */
router.route('/all')
  .get(protect, getAllActivities);

/**
 * @swagger
 * /activity/:activityId:
 *   get:
 *     security:
 *       - Authentication: []
 *     summary: Get single activity for the current user
 *     tags:
 *       - Activity
 *     description: Get single activity for the current user
 *     parameters:
 *         - in: header
 *           name: x-access-token
 *           required: true
 *           description: JWT access token
 *           schema:
 *             type: string
 *     responses:
 *       200:
 *         description: Success. Single Activity for the current user retrieved
 *       401:
 *         description: Unauthorized. User not logged in
 *       404:
 *         description: Failed. Activity not found
 *       500:
 *         description: Can't retrieve Activity
 *
 */
router.route('/:activityId')
  .get(protect, getSingleActivity);

/**
 * @swagger
 * /activity/create:
 *   post:
 *     security:
 *       - Authentication: []
 *     summary: Create new activity
 *     tags:
 *       - Activity
 *     description: Create new activity
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
 *                   description: The name of the activity
 *                 activityType:
 *                   type: string
 *                   description: The type of the activity
 *                   enum:
 *                     - Bar
 *                     - Bistort
 *                     - Gelateria
 *                     - Hamburgheria
 *                     - Piadineria
 *                     - Pizzeria
 *                     - Ristorante
 *                     - Stabilimento Balneare
 *                 activityAddress:
 *                   type: string
 *                   description: The address of the activity
 *                 status:
 *                   type: string
 *                   description: The status of the activity
 *                   enum:
 *                     - active
 *                     - inactive
 *               required:
 *                 - name
 *                 - activityType
 *                 - activityAddress
 *     responses:
 *       200:
 *         description: Success. Activity crated
 *       400:
 *         description: Failed. Some fields not supported
 *       401:
 *         description: Unauthorized. User not logged in
 *       409:
 *         description: Conflict error, data is already present in db
 *
 */
router.route('/create')
  .post(protect, createActivity);

module.exports = router;
