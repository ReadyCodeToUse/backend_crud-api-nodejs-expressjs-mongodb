const bcryptjs = require('bcryptjs');
const crypto = require("crypto");
const {check, validationResult} = require("express-validator");
const jwt = require("jsonwebtoken");
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

    console.log(password);
    const randomUserId = crypto.randomBytes(8).toString('hex');

    // Generate JWT token
    const token = jwt.sign(
        { randomUserId, email},
        process.env.TOKEN_KEY,
        {
            expiresIn: "2h",
        }
    );
    await User.create ({
        name: name,
        surname : surname,
        email : email,
        password: password,
        role: role
    }).then(() =>{
        const body = {
            Operation: 'SAVE',
            Message: 'SUCCESS',
            Item: req.body,
            Token: token,
            expiresIn: '2h'
        }
        res.json(body);
    }, error =>{
        error.message = 'Username must be unique, try another';
        console.error('Do your custom error handling here. I am just ganna log it out: ', error);
        res.status(500).send(error);
    })
});
/*


exports.loginUser = ([
    check('Username', 'Username is required').notEmpty(),
    check('password', 'Password is required').notEmpty(),
], async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({errors: errors.array()});
    }
    let {Username, password} = req.body;


    const params = {
        TableName: dynamodbTableName,
        Key: {
            'Username': Username
        },
        ConditionExpression: 'attribute_exists(Username)'
    }

    await dynamodb.get(params).promise().then(async response => {
        res.status(200);
        //res.json(response.Item);
        if (response.Item == null) {
            const body = {
                Operations: 'GET',
                Status: 'true',
                Message: 'User or password are wrong, try another',
                User: null
            }
            res.json(body);
        } else {
            if (await bcrypt.compare(password, response.Item.password)) {
                // Generate JWT token
                const token = jwt.sign(
                    { user_id: response.Item.user_id, email: response.Item.email},
                    process.env.TOKEN_KEY,
                    {
                        expiresIn: "2h",
                    }
                );

                const body = {
                    Operations: 'GET',
                    Status: 'true',
                    Message: 'User logged in',
                    Token: token
                }
                res.json(body);

            } else {
                res.json("error");
            }

        }
    }, error => {
        error.message = 'There was an error, try later';
        console.error('Do your custom error handling here. I am just ganna log it out: ', error);
        res.status(500).send(error);
    })


});

 */

