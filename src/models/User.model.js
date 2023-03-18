const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    name: {
        type: String,
        unique: false,
        required: true,
        lowercase: true,
    },
    surname: {
        type: String,
        unique: false,
        required: true,
        lowercase: true,
    },
    email: {
        type: String,
        unique: true,
        required: true,
        lowercase: true,
    },
    password: {
        type: String,
        required: true
    },
    role: {
        type: String,
        required: true
    }
}, {collection: "Users"})


exports.User = mongoose.model("User", UserSchema);