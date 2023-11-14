const User = require('../models/user-model');
const APIFeatures = require('../utils/api-features');
const handleAsync = require('../utils/handle-async');

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

exports.deleteUser = (req, res, next) => getStub(req, res);
