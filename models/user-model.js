const mongoose = require('mongoose');
const bcript = require('bcryptjs');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'User must have a name'],
    trim: true,
    maxlength: [100, 'User name must be <= 100 chars'],
    minlength: [3, 'User name must be >= 3 chars'],
  },
  email: {
    type: String,
    required: [true, 'User must have an email'],
    trim: true,
    unique: true,
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
    validate: {
      validator: function (value) {
        // this - только при создании (only on create and save), не работает при обновлении
        return value === this.password;
      },
      message: 'password not valid',
    },
  },
});

userSchema.pre('save', async function (next) {
  //если пароль не был изменен, то шифровать не надо
  if (!this.isModified('password')) return next();

  //если пароль был изменен, то вызываем функцию хеширования
  this.password = await bcript.hash(this.password, 12);
  this.passwordConfirm = undefined;
  next();
});

const User = mongoose.model('User', userSchema);

module.exports = User;
