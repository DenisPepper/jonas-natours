const express = require('express');

const router = express.Router();

const getStub = (req, res) => {
  res.status(500).send('server error!');
};

const getAllUsers = (req, res) => {
  return getStub(req, res);
};

const createUser = (req, res) => {
  return getStub(req, res);
};

const getUsersById = (req, res) => {
  return getStub(req, res);
};

const updateUser = (req, res) => {
  return getStub(req, res);
};

const deleteUser = (req, res) => {
  return getStub(req, res);
};

router.route('/').get(getAllUsers).post(createUser);
router.route('/:id').get(getUsersById).patch(updateUser).delete(deleteUser);

module.exports = router;
