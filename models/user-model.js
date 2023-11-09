const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'User must have a name'],
    unique: true,
    trim: true,
    maxlength: [100, 'User name must be <= 100 chars'],
    minlength: [3, 'User name must be >= 3 chars'],
  },
  email: {
    type: String,
    required: [true, 'User must have an email'],
    trim: true,
    lowercase: true,
    validate: {
      validator: function (value) {
        // this - только при создании, не работает при обновлении
        return /^[^@]+@[^@.]+\..+$/.test(value);
      },
      message: 'email not valid',
    },
  },
  photo: { type: String },
  password: {
    type: String,
    required: [true, 'User must have a password'],
    trim: true,
    maxlength: [100, 'User pass must be <= 100 chars'],
    minlength: [3, 'User pass must be >= 8 chars'],
  },
  passwordConfirm: {
    type: String,
    required: [true, 'Confirm password'],
    trim: true,
  },
});

const User = mongoose.model('User', userSchema);

module.exports = User;
