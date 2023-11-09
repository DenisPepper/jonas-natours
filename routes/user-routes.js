const express = require('express');
const authController = require('../controllers/auth-controller');
const userController = require('../controllers/user-controller');

const router = express.Router();

router.post('/signup', authController.signup);

router
  .route('/')
  .get(userController.getAllUsers)
  .post(userController.createUser);
router
  .route('/:id')
  .get(userController.getUsersById)
  .patch(userController.updateUser)
  .delete(userController.deleteUser);

module.exports = router;
