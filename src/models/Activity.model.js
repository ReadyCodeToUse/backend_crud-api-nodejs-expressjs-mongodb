const mongoose = require('mongoose');
const geocoder = require('../../utils/geocoder');
const { ActivityType } = require('../../utils/enums/activity.enum');

const ActivitySchema = new mongoose.Schema({
  user_id: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: true,
  },
  name: {
    type: String,
    unique: false,
    required: ['Activitu Name is required'],
    minLength: 3,
    maxLength: 50,
    lowercase: true,
  },
  activityType: {
    type: String,
    required: ['Activity Type is required'],
    enum: {
      values: [
        ActivityType.BAR,
        ActivityType.BISTROT,
        ActivityType.GELATERIA,
        ActivityType.HAMBURGHERIA,
        ActivityType.PIADINERIA,
        ActivityType.PIZZERIA,
        ActivityType.RISTORANTE,
        ActivityType.STABILIMENTO_BALNEARE,
      ],
      message: '{VALUE} is not supported. Supported values are: [\'bar\', \'bistro\', \'gelateria\', \'hamburgheria\', \'pizzeria\', \'ristorante\', \'stabilimento_balneare\']',
    },
  },
  activityAddress: {
    type: String,
    required: [true, 'Please add an address'],
  },
  location: {
    // GeoJSON Point
    type: {
      type: String,
      enum: ['Point'],

    },
    coordinates: {
      type: [Number],
      index: '2dsphere',
    },
    formattedAddress: String,
    street: String,
    city: String,
    states: String,
    zipcode: String,
    country: String,
  },
  status: {
    type: String,
    default: 'active',
    required: true,
  },
  menus: {
    type: Array,
    required: false,
  },
}, { collection: 'activity' });

ActivitySchema.set('timestamps', true);
ActivitySchema.set('toObject', { getters: true });
ActivitySchema.set('toJSON', { virtuals: true });
ActivitySchema.pre('save', async function (next) {
  const loc = await geocoder.geocode(this.activityAddress);
  this.location = {
    type: 'Point',
    coordinates: [loc[0].longitude, loc[0].latitude],
    formattedAddress: loc[0].formattedAddress,
    street: loc[0].streetName,
    city: loc[0].city,
    state: loc[0].state,
    zipcode: loc[0].zipcode,
    country: loc[0].countryCode,
  };

  // Do not save address on db
  this.activityAddress = undefined;
  next();
});

ActivitySchema.pre('findOneAndDelete', async function (next) {
  const MenuSchema = mongoose.model('menu');
  console.log(`Menus being removed from activity ${this._conditions._id}`);
  await MenuSchema.deleteMany({
    activity_id: this._conditions._id,
  });
  next();
});

exports.Activity = mongoose.model('activity', ActivitySchema);
