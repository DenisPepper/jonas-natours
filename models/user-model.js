const crypto = require('crypto');
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
        // this - только при создании и сохранении (only on create and save), не работает при обновлении
        return value === this.password;
      },
      message: 'password not valid',
    },
  },
  passwordChangedAt: { type: Date, select: false },
  passwordResetToken: { type: String, select: false },
  passwordResetExpires: { type: Date, select: false },
  isActive: { type: Boolean, default: true, select: false },
});

/*
Методы промежуточного программного обеспечения
*/
userSchema.pre('save', async function (next) {
  //если пароль не был изменен, то шифровать не надо
  if (!this.isModified('password')) return next();

  //если пароль был изменен, то вызываем функцию хеширования
  this.password = await bcript.hash(this.password, 12);
  this.passwordConfirm = undefined;
  next();
});

userSchema.pre('save', function (next) {
  // если это новый документ или пароль не был изменен,
  // то время последнего изменения регистрировать не надо
  if (this.isNew || !this.isModified('password')) return next();

  // при установке времени изменения вычитаем 1 секунду ,т.к. запись в базу данных может
  // быть выполненна позже, чем будет создан JWT токен, и тогда
  // пользователь не пройдет проверку в hasBeenChangedPasswordAfterToken()
  this.passwordChangedAt = Date.now() - 1000;
  next();
});

// исклечение из выборки неактивных пользователей
userSchema.pre(/^find/, function (next) {
  // $ne: false - потому что могут быть undefined
  this.find({ isActive: { $ne: false } });
  next();
});

//AGGREGATION MIDDLEWARE
// исклечение из выборки неактивных пользователей
userSchema.pre('aggregate', function (next) {
  // this - это агрегация
  // $ne: false - потому что могут быть undefined
  this.pipeline().unshift({ $match: { isActive: { $ne: false } } });
  next();
});

/*
Статические методы для работы с выборкой
*/
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

// Создает токен для сброса пароля, который будет отправлен пользователю на почту
userSchema.methods.createPasswordResetToken = function () {
  const resetToken = crypto.randomBytes(32).toString('hex');
  this.passwordResetToken = crypto
    .createHash('sha256')
    .update(resetToken)
    .digest('hex');

  //10 минут на смену пароля
  this.passwordResetExpires = Date.now() + 10 * 60 * 1000;
  return resetToken;
};

const User = mongoose.model('User', userSchema);

module.exports = User;
