const express = require('express');
const authController = require('../controllers/auth-controller');
const reviewController = require('../controllers/review-controller');

const router = express.Router();

router
  .route('/')
  .get(authController.protect, reviewController.getReviews)
  .post(authController.protect, reviewController.createReview);

module.exports = router;
