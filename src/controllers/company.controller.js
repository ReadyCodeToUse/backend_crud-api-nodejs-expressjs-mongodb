const successResponse = require('../../utils/successResponse');
const {authLogger} = require ('../../utils/logger');


const {Company} = require ('../models/Company.model');
const {User} = require ('../models/Company.model');


exports.createCompany = ([],async (req,res,next) => {

    req.body.user = req.user.id;


    const company = await Company.create(req.body).then((company)=>{
        res.status(200).json(company);
    }, error => {
        res.status(500).json(error);
    });

})