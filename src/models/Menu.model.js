const mongoose = require('mongoose');

const ItemSchema = new mongoose.Schema({
  itemName: {
    type: String,
    required: ['Item name is required'],
  },
  itemDescription: {
    type: String,
    minLength: 5,
    maxLength: 500,
    default: '',
    required: false,
  },
  itemImage: {
    type: String,
    default: '',
    required: false,
  },
  category: {
    type: String,
    required: ['Item category is required'],
  },
  show: {
    type: Boolean,
    default: true,
  },
  itemPrice: {
    type: String,
    required: ['Item price is required'],
  },
});

const MenuSchema = new mongoose.Schema({
  name: {
    type: String,
    required: ['Menu name is required'],
    minLength: 5,
    maxLength: 50,
  },
  description: {
    type: String,
    minLength: 5,
    maxLength: 500,
  },
  itemCustomCategoryList: {
    type: Array,
    required: false,
    category: {
      type: String,
      lowercase: true,
      minLength: 3,
      maxLength: 50,
      required: true,
    },
  },
  isDynamic: {
    type: Boolean,
    required: true,
  },
  show: {
    type: Boolean,
    default: true,
  },
  items: {
    type: [ItemSchema],
  },
}, { collection: 'menu' });

MenuSchema.set('timestamps', true);
MenuSchema.set('toObject', { getters: true });
MenuSchema.set('toJSON', { virtuals: true });

exports.Menu = mongoose.model('menu', MenuSchema);
