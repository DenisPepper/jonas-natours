const express = require('express');
const tourController = require('../controllers/tour-controller');
const authController = require('../controllers/auth-controller');
const reviewRouter = require('./review-router');

const router = express.Router();

// это middleware сработает для параметра id
//router.param('id', tourController.checkId);

router
  .route('/')
  .get(tourController.getTours)
  .post(
    authController.protect,
    authController.allowTo('admin', 'lead-guide'),
    tourController.createTour,
  );

router.route('/tour-stats').get(tourController.getTourStats);

router
  .route('/monthly-plan/:year')
  .get(
    authController.protect,
    authController.allowTo('admin', 'lead-guide', 'guide'),
    tourController.getMonthlyPlan,
  );

router
  .route('/top-5-cheap')
  .get(tourController.aliasTopTours, tourController.getTours);

router
  .route('/:id')
  .get(tourController.getTourById)
  .patch(
    authController.protect,
    authController.allowTo('admin', 'lead-guide'),
    tourController.updateTour,
  )
  .delete(
    authController.protect,
    authController.allowTo('admin', 'lead-guide'),
    tourController.deleteTour,
  );

// перенаправит   /:tourID/reviews    на    /    reviewRouter-а
router.use('/:tourID/reviews', reviewRouter);

module.exports = router;
