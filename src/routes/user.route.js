const express = require('express');
const {
    getAllUsers,
} = require('../controllers/user.controller');

const router = express.Router({mergeParams: true});

router.route('/')
    .get(getAllUsers)


module.exports = router;