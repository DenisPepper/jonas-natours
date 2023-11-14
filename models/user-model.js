const mongoose = require('mongoose');
const bcript = require('bcryptjs');

const DECIMAL_RADIX = 10;

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
  role: {
    type: String,
    enum: ['user', 'guide', 'lead-guide', 'admin'],
    default: 'user',
  },
  photo: { type: String },
  password: {
    type: String,
    required: [true, 'User must have a password'],
    trim: true,
    maxlength: [100, 'User pass must be <= 100 chars'],
    minlength: [3, 'User pass must be >= 8 chars'],
    select: false, //исключит поле из результата выборки
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
  passwordChangedAt: { type: Date, select: false },
});

userSchema.pre('save', async function (next) {
  //если пароль не был изменен, то шифровать не надо
  if (!this.isModified('password')) return next();

  //если пароль был изменен, то вызываем функцию хеширования
  this.password = await bcript.hash(this.password, 12);
  this.passwordConfirm = undefined;
  next();
});

//сработает после выборки
//определит для модели пользователя метод для проверки введенного пароля
userSchema.methods.comparePasswords = async function (
  incomingPassword,
  userPassword,
) {
  return await bcript.compare(incomingPassword, userPassword);
};

// сработает после выборки
// определит для модели пользователя метод сравнения даты последней смены пароля
// с датой подписи токена, который передает клиент
// после смены пароля - токен считается невалидным
userSchema.methods.hasBeenChangedPasswordAfterToken = function (
  tokenTimestamp,
) {
  if (!this.passwordChangedAt) return false;

  const changingTimestamp = parseInt(
    this.passwordChangedAt.getTime() / 1000,
    DECIMAL_RADIX,
  );
  return changingTimestamp > tokenTimestamp;
};

const User = mongoose.model('User', userSchema);

module.exports = User;
