const mongoose = require('mongoose');
const geocoder = require("../../utils/geocoder");


const validateEmail = (email) =>{
    let re = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    return re.test(email)
}


const UserSchema = new mongoose.Schema({
    firstName: {
        type: String,
        unique: false,
        required: ['First Name is required'],
        minLength: 3,
        maxLength: 50,
        lowercase: true,
    },
    lastName: {
        type: String,
        unique: false,
        required: ['Last Name is required'],
        minLength: 3,
        maxLength: 50,
        lowercase: true,
    },
    birthDate: {
        // format: YYYY-MM-DD
        type: String,
        unique: false,
        required: ['Birth Date is required'],
        minLength: 3,
        maxLength: 50,
        lowercase: true,

    },
    sex: {
        type: String,
        required: ['Sex is required'],
        enum: {
            values: ['M','F','N'],
            message: '{VALUE} is not supported. Supported value: M, F, N]',
        }
    },
    email: {
        type: String,
        unique: true,
        required: ['Email is required'],
        lowercase: true,
        validate: [validateEmail, 'Please fill a valid email address'],
        match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'Please fill a valid email address']
    },

    loginData: {
        username: {
            type: String,
            unique: true,
            required: ['Username is required'],
            lowercase: false,
            index: true,
            minLength: 5,
            maxLength: 50,
        },
        password: {
            type: String,
            required: true
        },
        isActive: {
            type: Boolean,
            default: 0
        },
        role: {
            type: String,
            enum: {
                values: ['admin', 'user'],
                message: '{VALUE} is not supported'
            },
            required: true
        }
    },
    address: {
        type: String,
        required: [true, 'Please add an address']
    },
    location: {
        //GeoJSON Point
        type: {
            type: String,
            enum: ['Point'],

        },
        coordinates: {
            type: [Number],
            index: '2dsphere'
        },
        formattedAddress: String,
        street: String,
        city: String,
        states: String,
        zipcode: String,
        country: String
    },


}, {collection: "users"})

UserSchema.set("timestamps", true);

UserSchema.pre('save', async function (next) {
    const loc = await geocoder.geocode(this.address);
    this.location = {
        type: 'Point',
        coordinates: [loc[0].longitude, loc[0].latitude],
        formattedAddress: loc[0].formattedAddress,
        street: loc[0].streetName,
        city: loc[0].city,
        state: loc[0].state,
        zipcode: loc[0].zipcode,
        country: loc[0].countryCode,
    }

    // Do not save address on db
    this.address = undefined;
    next();
});


exports.User = mongoose.model("user", UserSchema);