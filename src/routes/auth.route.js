const express = require('express');
const {
    registerUser,
    loginUser,
    getMe,
    logout
} = require('../controllers/auth.controller');

const {protect} = require('../middleware/auth');

const router = express.Router({mergeParams: true});

router.route('/register')
    .post(registerUser)


router.route('/login')
    .post(loginUser)

router.route('/me')
    .get(protect, getMe)

router.route('/logout')
    .get(logout)



module.exports = router;