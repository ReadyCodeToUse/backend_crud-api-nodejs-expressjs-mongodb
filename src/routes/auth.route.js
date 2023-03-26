const express = require('express');
const {
    registerUser,
    loginUser,
    getMe,
    logout
} = require('../controllers/auth.controller');

const auth = require('../middleware/auth');

const router = express.Router({mergeParams: true});

router.route('/register')
    .post(registerUser)


router.route('/login')
    .post(loginUser)

router.route('/me')
    .get(auth, getMe)

router.route('/logout')
    .get(logout)
module.exports = router;