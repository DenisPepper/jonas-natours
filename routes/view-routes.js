const express = require('express');
const viewController = require('../controllers/view-controller');
const authController = require('../controllers/auth-controller');

const router = express.Router();

// добавит роут для просмотра краткой информации о турах
router.get('/', authController.isLoggedIn, viewController.getOverview);

// добавит роут для просмотра отдельного тура
router.get('/tour/:slug', authController.isLoggedIn, viewController.getTour);

// логин
router.get('/login', authController.isLoggedIn, viewController.getLoginForm);

// личный кабинет
router.get('/my-user', authController.protect, viewController.getAccount);

module.exports = router;
