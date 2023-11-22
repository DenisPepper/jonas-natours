const express = require('express');
const authController = require('../controllers/auth-controller');
const reviewController = require('../controllers/review-controller');

// благодаря mergeParams: true этот роутер будет иметь доступ к параметрам
// другого роутера в случае перенаправления, например к :tourID
// из роутера туров при перенаправлении: router.use('/:tourID/reviews', reviewRouter);
const router = express.Router({ mergeParams: true });

// потребует авторизацию для всех нижележащих роутов
router.use(authController.protect);

router
  .route('/')
  .get(reviewController.getReviews)
  .post(
    authController.allowTo('user'),
    reviewController.checkRequestBody,
    reviewController.createReview,
  );

router
  .route('/:id')
  .get(reviewController.getReviewById)
  .patch(authController.allowTo('admin', 'user'), reviewController.updateReview)
  .delete(
    authController.allowTo('admin', 'user'),
    reviewController.deleteReview,
  );

module.exports = router;
