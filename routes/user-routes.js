const express = require('express');
const authController = require('../controllers/auth-controller');
const userController = require('../controllers/user-controller');

const router = express.Router();

// все middleware выполняются последовательно сверху - вниз

router.post('/signup', authController.signup);
router.post('/login', authController.login);
router.get('/logout', authController.logout);
router.post('/forgotPassword', authController.forgotPassword);
router.patch('/resetPassword/:token', authController.resetPassword);

// потребует авторизацию для всех нижележащих роутов
router.use(authController.protect);

router.get('/my-user', userController.setAuthId, userController.getUserById);

router.patch('/updatePassword', authController.updatePassword);
router.patch(
  '/updateUserInfo',
  userController.uploadUserPhoto,
  userController.resizeUserPhoto,
  userController.updateUserInfo,
);
router.delete('/deleteUser', userController.deleteMyUser);

// потребует наличие роли admin для всех нижележащих роутов
router.use(authController.allowTo('admin'));

router.route('/').get(userController.getAllUsers);

router
  .route('/:id')
  .get(userController.getUserById)
  .patch(userController.updateUser)
  .delete(userController.deleteUser);

module.exports = router;
