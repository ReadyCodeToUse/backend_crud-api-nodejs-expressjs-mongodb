const express = require('express');
const {
    registerUser,
    loginUser,
    getMe,
    logout,
    updatePassword
} = require('../controllers/auth.controller');

const {protect} = require('../middleware/auth');

const router = express.Router({mergeParams: true});

/**
 * @swagger
 * /auth/register:
 *   post:
 *     summary: Register new user
 *     tags:
 *       - Auth
 *     description: Register new User
 *     requestBody:
 *         required: true
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 firstName:
 *                   type: string
 *                   description: The name of the user
 *                 lastName:
 *                   type: string
 *                   description: The last name of the user
 *                 birthDate:
 *                   type: string
 *                   description: The birth name of the user
 *                 sex:
 *                   type: string
 *                   description: The sex of the user
 *                   enum:
 *                     - M
 *                     - S
 *                     - N
 *                 email:
 *                   type: string
 *                   description: The email of the user
 *                 loginData:
 *                   type: object
 *                   description: Object for login data used to log in the user
 *                   properties:
 *                     username:
 *                        type: string
 *                     password:
 *                        type: string
 *                     role:
 *                        type: string
 *                        description: Role for the role base auth
 *                        enum:
 *                          - admin
 *                          - user
 *                   required:
 *                     - username
 *                     - password
 *                     - role
 *                 address:
 *                   type: string
 *                   description: Full address used to create location object
 *               required:
 *                 - firstName
 *                 - lastName
 *                 - birthDate
 *                 - sex
 *                 - email
 *                 - address
 *                 - loginData
 *
 *     responses:
 *       200:
 *         description: Success. User created
 *       409:
 *         derscription: Conflict error, data is already present in db
 *
 */
router.route('/register')
    .post(registerUser)

/**
 * @swagger
 * /auth/login:
 *   post:
 *     summary: User login
 *     tags:
 *       - Auth
 *     description: User login
 *     requestBody:
 *         required: true
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 email:
 *                   type: string
 *                   description: The email of the user
 *                 password:
 *                   type: string
 *                   description: Password
 *               required:
 *                 - email
 *                 - password
 *     responses:
 *       200:
 *         description: Success. User created
 *         content:
 *             application/json:
 *               schema:
 *                 type: object
 *                 properties:
 *                   data:
 *                     type: object
 *                     properties:
 *                       token:
 *                         type: string
 *                       expireIn:
 *                         type: string
 *       400:
 *         description: Login failed
 *
 *
 */
router.route('/login')
    .post(loginUser)

/**
 * @swagger
 * /auth/me:
 *   get:
 *     security:
 *       - Authentication: []
 *     summary: Get Current user logged in
 *     tags:
 *       - Auth
 *     description: Get Current user logged in
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
router.route('/me')
    .get(protect, getMe)


/**
 * @swagger
 * /auth/logout:
 *   get:
 *     security:
 *       - Authentication: []
 *     summary: Logout Current user logged in
 *     tags:
 *       - Auth
 *     description: Logout Current user logged in
 *     parameters:
 *         - in: header
 *           name: x-access-token
 *           required: true
 *           description: JWT access token
 *           schema:
 *             type: string
 *     responses:
 *       200:
 *         description: Success. User logged out
 *       400:
 *         description: Logged failed
 *
 *
 */
router.route('/logout')
    .get(logout)

router.route('/updatepassword')
    .put(protect, updatePassword)


module.exports = router;