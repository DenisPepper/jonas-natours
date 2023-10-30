const express = require('express');
const tourController = require('../controllers/tour-controller');
const router = express.Router();

// это middleware сработает для параметра id
router.param('id', (req, res, next, val) => {
  console.log(`val is ${val}`);

  next();
});

router.route('/').get(tourController.getTours).post(tourController.createTour);

router
  .route('/:id')
  .get(tourController.getTourById)
  .patch(tourController.updateTour)
  .delete(tourController.deleteTour);

module.exports = router;
