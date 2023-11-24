const express = require('express');
const viewController = require('../controllers/view-controller');

const router = express.Router();

// добавит роут для просмотра краткой информации о турах
router.get('/', viewController.getOverview);

// добавит роут для просмотра отдельного тура
router.get('/tour', viewController.getTour);

module.exports = router;
