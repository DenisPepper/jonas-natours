const express = require('express');
const viewController = require('../controllers/view-controller');
const authController = require('../controllers/auth-controller');

const router = express.Router();

// будет проверять авторизационные куки и передавать
// данные для вьюшек в зависимости от авторизаци
router.use(authController.isLoggedIn);

// добавит роут для просмотра краткой информации о турах
router.get('/', viewController.getOverview);

// добавит роут для просмотра отдельного тура
router.get('/tour/:slug', viewController.getTour);

// логин
router.get('/login', viewController.getLoginForm);

module.exports = router;
