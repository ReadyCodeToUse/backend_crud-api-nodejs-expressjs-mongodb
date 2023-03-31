const {check, validationResult} = require("express-validator");

//const env = process.env.NODE_ENV || "prod";


const {User} = require('../models/User.model');
const errorHandler = require("../middleware/errorHandler");

/**
 * @param req
 * @param res
 * @param next
 * @description     Register User
 * @route           POST /auth/register
 * @access          Public
 */
exports.getAllUsers = ([

], async (req, res, next) => {

    //encrypt password
    User.find().then(user => {
        if(user){
            res.json(user);
        }else{
            const body = {
                message: "no user found"
            }
            res.json(body);

        }

    }, error => {
        next(error);
    })


});
