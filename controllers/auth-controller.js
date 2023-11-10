const User = require('../models/user-model');
const handleAsync = require('../utils/handle-async');

exports.signup = handleAsync(async (req, res, next) => {
  const user = await User.create({
    name: req.body.name,
    email: req.body.email,
    password: req.body.password,
    passwordConfirm: req.body.passwordConfirm,
  });
  res.status(201).json({
    status: 'success',
    data: {
      user,
    },
  });
});
