const mongoose = require('mongoose');
const geocoder = require('../../utils/geocoder');


const CompanySchema = new mongoose.Schema({

    name: {
        type: String,
        required: true,
        minLength: 3,
        maxLength: 50,
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
    user: {
        type: mongoose.Schema.ObjectId,
        ref: 'user',
        required: true
    }

}, {collection: 'companies'});


// Geocode & creation location field
CompanySchema.pre('save', async function (next) {
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



exports.Company = mongoose.model('Company', CompanySchema);