const crypto = require('crypto');
const { promisify } = require('util');
const jwt = require('jsonwebtoken');
const User = require('../models/user-model');
const handleAsync = require('../utils/handle-async');
const AppError = require('../utils/app-error');
const sendEmail = require('../utils/email');

const signToken = (id) =>
  jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });

const createSendToken = (user, statusCode, res) => {
  res.status(statusCode).json({
    status: 'success',
    token: signToken(user._id),
    data: {
      name: user.name,
      email: user.email,
      role: user.role,
    },
  });
};

exports.signup = handleAsync(async (req, res, next) => {
  const user = await User.create({
    name: req.body.name,
    email: req.body.email,
    password: req.body.password,
    passwordConfirm: req.body.passwordConfirm,
  });

  createSendToken(user, 201, res);
});

exports.login = handleAsync(async (req, res, next) => {
  const { email, password } = req.body;

  // проверка почты и пароля
  if (!email || !password)
    return next(new AppError('Please, check email and password!', 400));

  //получение пользователя
  //password на уровне модели исключен из выборки, но в этом запросе добавлен оператором select('+password')
  const user = await User.findOne({ email }).select('+password');

  // проверка пользователя и пароля
  if (!user || !(await user.comparePasswords(password, user.password)))
    return next(new AppError('email or password not valid!', 401));

  createSendToken(user, 200, res);
});

exports.protect = handleAsync(async (req, res, next) => {
  // получаем токен и проверяем его поддлинность
  let tokenJWT = '';
  if (req.headers.authorization?.startsWith('Bearer')) {
    tokenJWT = req.headers.authorization.split(' ').pop();
  }
  if (!tokenJWT) return next(new AppError('You are not authorized!', 401));

  const verifiedToken = await promisify(jwt.verify)(
    tokenJWT,
    process.env.JWT_SECRET,
  );

  // проверяем пользователя, что он существует и
  // что, с момента получения токена, пользователь не менял пароль, т.к.
  // при краже токена пользователь мог в целях безопасности сменить свой пароль
  const user = await User.findById(verifiedToken.id).select(
    '+passwordChangedAt',
  );
  if (!user || user.hasBeenChangedPasswordAfterToken(verifiedToken.iat))
    return next(
      new AppError('Your token is not valid! You must authorize', 401),
    );

  // добавит пользователя в объект запроса для повторного переиспользования
  req.user = user;

  next();
});

exports.allowTo =
  (...roles) =>
  (req, res, next) => {
    if (!roles.includes(req.user.role))
      return next(
        new AppError(
          'Your role does not allow you to perform this action',
          403,
        ),
      );

    next();
  };

// сброс пароля
exports.forgotPassword = handleAsync(async (req, res, next) => {
  // 1 Получаем пользователя по адресу почты
  const user = await User.findOne({ email: req.body.email }).select([
    '+passwordResetToken',
    '+passwordResetExpires',
  ]);
  if (!user)
    return next(new AppError('There is no user with email address!', 404));

  // 2 Создаем токен для сброса пароля и сохраняем токен и дату истечения токена в БД
  const resetToken = user.createPasswordResetToken();
  // при сохранении отключим валидацию
  await user.save({ validateBeforeSave: false });

  // 3 Отправляем сообщение
  const resetUrl = `${req.protocol}://${req.get(
    'host',
  )}/api/v1/users/resetPassword/${resetToken}`;

  try {
    await sendEmail({
      email: user.email,
      subject: 'Reset token (valid for 10 min)',
      message: `Reset link: ${resetUrl}`,
    });
    res.status(204).send();
  } catch (error) {
    // в случае ошибки при отправке сообщения обнуляем токен и время жизни токена
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;
    await user.save({ validateBeforeSave: false });
    return next(
      new AppError(
        'An error occurred while sending the email. Try again later!',
        500,
      ),
    );
  }
});

exports.resetPassword = handleAsync(async (req, res, next) => {
  // 1 Получаем пользователя по токену из письма
  const { token: resetToken } = req.params;
  // шифруем токен (также как и в момент его создания при сбросе в процедуре createPasswordResetToken)
  // , чтобы найти по зашифрованному токену пользователя
  const hashedToken = crypto
    .createHash('sha256')
    .update(resetToken)
    .digest('hex');
  // ищем пользователя по токену и по времени жизни токена, т.к. время жизни токена -  минут
  const user = await User.findOne({
    passwordResetToken: hashedToken,
    passwordResetExpires: { $gt: Date.now() },
  }).select([
    '+passwordResetToken',
    '+passwordResetExpires',
    '+passwordChangedAt',
  ]);

  // 2 Отправляем ошибку или Устанавливаем новый пароль, если пользователь есть и токен не просрочен
  if (!user)
    return next(new AppError('Token not valid or token was expire!', 400));
  // обновляем данные пользователя
  user.password = req.body.password;
  user.passwordConfirm = req.body.passwordConfirm;
  user.passwordResetToken = undefined;
  user.passwordResetExpires = undefined;
  await user.save();

  // 3 Логиним пользователя и отправляем новый JWT
  createSendToken(user, 201, res);
});

// обновление пароля - вызывается после protect
exports.updatePassword = handleAsync(async (req, res, next) => {
  const { currentPassword, password, passwordConfirm } = req.body;
  // req.user - существует в оперативной памяти сервера после авторизации в protect
  const { _id: id } = req.user;

  // 1 Получаем документ пользователя
  const user = await User.findById(id).select('+password');

  // 2 проверка на совпадение введенного пароля и сохраненного
  if (!(await user.comparePasswords(currentPassword, user.password)))
    return next(new AppError('You enter invalid password!', 401));

  user.password = password;
  user.passwordConfirm = passwordConfirm;
  await user.save();

  // 3 Логиним пользователя и отправляем новый JWT
  createSendToken(user, 201, res);
});
