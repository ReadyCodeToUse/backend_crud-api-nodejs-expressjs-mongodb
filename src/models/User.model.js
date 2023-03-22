const mongoose = require('mongoose');


const validateEmail = (email) =>{
    let re = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    return re.test(email)
}


const UserSchema = new mongoose.Schema({
    name: {
        type: String,
        unique: false,
        required: ['Name is required'],
        lowercase: true,
    },
    surname: {
        type: String,
        unique: false,
        required: ['Surname is required'],
        lowercase: true,
    },
    email: {
        type: String,
        unique: true,
        required: ['Email is required'],
        lowercase: true,
        validate: [validateEmail, 'Please fill a valid email address'],
        match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'Please fill a valid email address']
    },
    password: {
        type: String,
        required: true
    },
    role: {
        type: String,
        enum: {
            values: ['admin', 'user'],
            message: '{VALUE} is not supported'
        },
        required: true
    }
}, {collection: "users"})

UserSchema.set("timestamps", true);


exports.User = mongoose.model("user", UserSchema);