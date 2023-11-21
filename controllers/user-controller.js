const User = require('../models/user-model');
const APIFeatures = require('../utils/api-features');
const handleAsync = require('../utils/handle-async');
const factory = require('./handler-factory');

const getStub = handleAsync(async (req, res, next) => {
  const features = new APIFeatures(User.find(), req.query)
    .filter()
    .sort()
    .limitFields()
    .paginate();

  const users = await features.query;

  res.status(200).json({
    status: 'success',
    results: users.length,
    data: {
      users,
    },
  });
});

exports.getAllUsers = (req, res, next) => getStub(req, res);

exports.createUser = (req, res, next) => getStub(req, res);

exports.getUsersById = (req, res, next) => getStub(req, res);

exports.updateUser = (req, res, next) => getStub(req, res);

exports.deleteUser = factory.deleteOneById(User);

exports.updateUserInfo = handleAsync(async (req, res, next) => {
  const { name, email } = req.body;
  // req.user - существует в оперативной памяти сервера после авторизации в protect
  const { _id: id } = req.user;

  // 1 Получаем документ пользователя
  const user = await User.findByIdAndUpdate(
    id,
    { name, email },
    {
      new: true,
      runValidators: true,
    },
  );

  res.status(200).json({
    status: 'success',
    data: user,
  });
});

exports.deleteMyUser = handleAsync(async (req, res, next) => {
  // req.user - существует в оперативной памяти сервера после авторизации в protect
  const { _id: id } = req.user;

  // 1 Получаем документ пользователя
  const user = await User.findByIdAndUpdate(id, { isActive: false });

  res.status(204).send();
});
