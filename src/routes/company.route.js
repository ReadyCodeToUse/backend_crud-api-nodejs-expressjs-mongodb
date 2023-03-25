const express = require('express');

const {createCompany} = require('../controllers/company.controller');

const router = express.Router({mergeParams: true});

router.route('/')
    .post(createCompany)


module.exports = router;