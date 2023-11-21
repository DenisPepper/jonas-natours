const express = require('express');
const authController = require('../controllers/auth-controller');
const userController = require('../controllers/user-controller');

const router = express.Router();

router.post('/signup', authController.signup);
router.post('/login', authController.login);

router.post('/forgotPassword', authController.forgotPassword);
router.patch('/resetPassword/:token', authController.resetPassword);
router.patch(
  '/updatePassword',
  authController.protect,
  authController.updatePassword,
);
router.patch(
  '/updateUserInfo',
  authController.protect,
  userController.updateUserInfo,
);
router.delete(
  '/deleteUser',
  authController.protect,
  userController.deleteMyUser,
);
router.route('/').get(userController.getAllUsers);

router
  .route('/:id')
  .get(userController.getUserById)
  .patch(
    authController.protect,
    authController.allowTo('admin'),
    userController.updateUser,
  )
  .delete(
    authController.protect,
    authController.allowTo('admin'),
    userController.deleteUser,
  );

module.exports = router;
