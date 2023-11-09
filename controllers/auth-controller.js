const User = require('../models/user-model');
const handleAsync = require('../utils/handle-async');

exports.signup = handleAsync(async (req, res, next) => {
  const user = await User.create(req.body);
  res.status(201).json({
    status: 'success',
    data: {
      user,
    },
  });
});
