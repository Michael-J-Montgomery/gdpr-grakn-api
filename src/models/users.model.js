// users-model.js - A mongoose model
//
// See http://mongoosejs.com/docs/models.html
// for more of what you can do here.
const validator = require('validator');

module.exports = function (app) {
  const mongooseClient = app.get('mongooseClient');
  const users = new mongooseClient.Schema({
    id: {
      type: Number,
      unique: true,
      required: true
    },
    email: {
      type: String,        
      trim: true,
      lowercase: true,
      unique: true,
      required: true,
      validate: { validator: value => validator.isEmail(value) , message: 'Invalid email.' }
    },
    password: {
      type: String,
      required: true
    },
    permissions: {
      type: String,
      required: false
    },
    firstName: {
      type: String,
      required: true
    },
    lastName: {
      type: String,
      required: true
    },

    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
  });

  return mongooseClient.model('users', users);
};
