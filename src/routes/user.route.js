const express = require('express');
const {
    getAllUsers,
} = require('../controllers/user.controller');

const {protect, authorize} = require("../middleware/auth");

const router = express.Router({mergeParams: true});

router.route('/')
    .get(protect,authorize('admin'), getAllUsers)


module.exports = router;