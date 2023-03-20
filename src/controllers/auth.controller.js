const bcryptjs = require('bcryptjs');
const crypto = require("crypto");
const {check, validationResult} = require("express-validator");
const jwt = require("jsonwebtoken");
const successRespone = require('../../utils/successResponse');
//const env = process.env.NODE_ENV || "prod";


const {User} = require('../models/User.model');

/**
 * @param req
 * @param res
 * @param next
 * @description     Register User
 * @route           POST /auth/register
 * @access          Public
 */
exports.registerUser = ([
    //check('Username', 'Username is required').notEmpty(),
    check('name', 'Name is required').notEmpty(),
    check('surname', 'Surname is required').notEmpty(),
    check('email', 'Email is required').notEmpty(),
    check('password', 'Password is required').notEmpty(),
], async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({errors: errors.array()});
    }
    let {Username, name, surname, email, password, role} = req.body;

    //encrypt password
    const salt = await bcryptjs.genSalt(10);
    password = await bcryptjs.hash(password, salt);
    const randomUserId = crypto.randomBytes(8).toString('hex');

    // Generate JWT token
    const token = jwt.sign(
        {randomUserId, email},
        process.env.TOKEN_KEY,
        {
            expiresIn: "2h",
        }
    );
    await User.create({
        name: name,
        surname: surname,
        email: email,
        password: password,
        role: role
    }).then(() => {
        const customData = {
            token: token,
            expiresIn: '2h'
        }
        successRespone(req,res,null,null,customData);
    }, error => {
        next(error);
        //res.status(500).json(error);
    })
});




exports.loginUser = ([
    check('Email', 'Email is required').notEmpty(),
    check('password', 'Password is required').notEmpty(),
], async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({errors: errors.array()});
    }
    let {email, password} = req.body;



    await User.findOne({email: email}).then(async user => {
        //user exists
        const bodyError = {
            status: 401,
            message: 'User or password incorrect. Please try again',
        }
        if(user){
            if (await bcryptjs.compare(password, user.password)) {
                // Generate JWT token
                console.log("User logged:" + user._id);
                const token = jwt.sign(
                    {_id: user._id, email: user.email},
                    process.env.TOKEN_KEY,
                    {
                        expiresIn: "2h",
                    }
                );

                const customData = {
                    responseMessage: 'Success User logged in',
                    token: token,
                    expiresIn: '2h'
                }
                successRespone(req,res,null,null, customData)
                //res.json(body);

            }else{
                res.status(401).json(bodyError);
            }
        }else{
            res.status(401).json(bodyError);
        }


    }, error => {
        //user not exists
        next(error);
        //res.status(500).json(error);
    })
});