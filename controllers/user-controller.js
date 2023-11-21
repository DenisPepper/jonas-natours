const User = require('../models/user-model');
const handleAsync = require('../utils/handle-async');
const factory = require('./handler-factory');

exports.getAllUsers = factory.getAll(User);

exports.getUserById = factory.getOneById(User);

exports.updateUser = factory.updateOneById(User);

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

exports.setAuthId = (req, res, next) => {
  // установит в параметры запросы id из токена
  // который определяется в процедуре authController.protect
  req.params.id = req.user.id;
  next();
};
