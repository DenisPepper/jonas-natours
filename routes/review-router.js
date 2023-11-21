const express = require('express');
const authController = require('../controllers/auth-controller');
const reviewController = require('../controllers/review-controller');

// благодаря mergeParams: true этот роутер будет иметь доступ к параметрам
// другого роутера в случае перенаправления, например к :tourID
// из роутера туров при перенаправлении: router.use('/:tourID/reviews', reviewRouter);
const router = express.Router({ mergeParams: true });

router
  .route('/')
  .get(reviewController.getReviews)
  .post(
    authController.protect,
    authController.allowTo('user'),
    reviewController.checkRequestBody,
    reviewController.createReview,
  );

router
  .route('/:id')
  .patch(
    authController.protect,
    authController.allowTo('admin', 'user'),
    reviewController.updateReview,
  )
  .delete(
    authController.protect,
    authController.allowTo('admin', 'user'),
    reviewController.deleteReview,
  );

module.exports = router;
