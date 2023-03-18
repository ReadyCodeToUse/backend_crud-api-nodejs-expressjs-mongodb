const express = require('express');
const {
    registerUser,
} = require('../controllers/auth.controller');

const router = express.Router({mergeParams: true});

router.route('/register')
    .post(registerUser)

/*
router.route('/login')
    .post(loginUser)

 */

module.exports = router;