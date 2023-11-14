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
  if (!user || !(await user.checkPassword(password, user.password)))
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
