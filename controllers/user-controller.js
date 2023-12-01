const multer = require('multer');
const User = require('../models/user-model');
const handleAsync = require('../utils/handle-async');
const factory = require('./handler-factory');
const AppError = require('../utils/app-error');

// построитель директории и имени файла
const multerStorage = multer.diskStorage({
  destination: (req, file, callback) => callback(null, 'public/img/users'),
  filename: (req, file, callback) => {
    const extention = file.mimetype.split('/').pop();
    callback(null, `user-${req.user.id}-${Date.now()}.${extention}`);
  },
});

// валидатор загружаемых файлов - пропустит только 'image'
const multerFilter = (req, file, callback) => {
  if (file.mimetype.startsWith('image')) {
    callback(null, true);
  } else {
    callback(new AppError('Not an image!', 400), false);
  }
};

const upload = multer({ storage: multerStorage, fileFilter: multerFilter });

exports.uploadUserPhoto = upload.single('photo');

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
