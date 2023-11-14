const express = require('express');
const tourController = require('../controllers/tour-controller');
const authController = require('../controllers/auth-controller');

const router = express.Router();

// это middleware сработает для параметра id
//router.param('id', tourController.checkId);

router
  .route('/')
  .get(authController.protect, tourController.getTours)
  .post(tourController.createTour);

router.route('/tour-stats').get(tourController.getTourStats);

router.route('/monthly-plan/:year').get(tourController.getMonthlyPlan);

router
  .route('/top-5-cheap')
  .get(tourController.aliasTopTours, tourController.getTours);

router
  .route('/:id')
  .get(tourController.getTourById)
  .patch(tourController.updateTour)
  .delete(tourController.deleteTour);

module.exports = router;
