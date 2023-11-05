const express = require('express');
const tourController = require('../controllers/tour-controller');

const router = express.Router();

// это middleware сработает для параметра id
//router.param('id', tourController.checkId);

router
  .route('/top-5-cheap')
  .get(tourController.aliasTopTours, tourController.getTours);

router.route('/').get(tourController.getTours).post(tourController.createTour);
//.post(tourController.checkBodyProps, tourController.createTour);

router
  .route('/:id')
  .get(tourController.getTourById)
  .patch(tourController.updateTour)
  .delete(tourController.deleteTour);

module.exports = router;
