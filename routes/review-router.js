const express = require('express');
const authController = require('../controllers/auth-controller');
const reviewController = require('../controllers/review-controller');

const router = express.Router();

router
  .route('/')
  .get(reviewController.getReviews)
  .post(
    authController.protect,
    authController.allowTo('user'),
    reviewController.createReview,
  );

module.exports = router;
