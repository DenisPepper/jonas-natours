const express = require('express');
const viewController = require('../controllers/view-controller');

const router = express.Router();

// добавит роут для просмотра краткой информации о турах
router.get('/', viewController.getOverview);

// добавит роут для просмотра отдельного тура
router.get('/tour/:slug', viewController.getTour);

// логин
router.get('/login', viewController.getLoginForm);

module.exports = router;
