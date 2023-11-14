const { promisify } = require('util');
const jwt = require('jsonwebtoken');
const User = require('../models/user-model');
const handleAsync = require('../utils/handle-async');
const AppError = require('../utils/app-error');

const signToken = (id) =>
  jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });

exports.signup = handleAsync(async (req, res, next) => {
  const user = await User.create({
    name: req.body.name,
    email: req.body.email,
    password: req.body.password,
    passwordConfirm: req.body.passwordConfirm,
  });

  res.status(201).json({
    status: 'success',
    token: signToken(user._id),
    data: {
      name: user.name,
      email: user.email,
      id: user._id,
    },
  });
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

  res.status(200).json({
    status: 'success',
    token: signToken(user._id),
    data: {
      name: user.name,
      email: user.email,
      id: user._id,
    },
  });
});

// TODO: протестировать этот метод на отказ, когда будет реализован роут для смены пароля
exports.protect = handleAsync(async (req, res, next) => {
  // получаем токен и проверяем его поддлинность
  let token = '';
  if (req.headers.authorization?.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ').pop();
  }
  if (!token) return next(new AppError('You are not authorized!', 401));

  const verifiedToken = await promisify(jwt.verify)(
    token,
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
