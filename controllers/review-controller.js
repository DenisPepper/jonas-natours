const Review = require('../models/review-model');
const APIFeatures = require('../utils/api-features');
const handleAsync = require('../utils/handle-async');
const AppError = require('../utils/app-error');

exports.getReviews = handleAsync(async (req, res, next) => {
  const features = new APIFeatures(Review.find(), req.query)
    .filter()
    .sort()
    .limitFields()
    .paginate();

  const reviews = await features.query;
  res.status(200).json({
    status: 'success',
    results: reviews.length,
    data: {
      reviews,
    },
  });
});

exports.createReview = handleAsync(async (req, res, next) => {
  // если браузер указал роут вручную,
  // нужно установить тур из строки запроса, а юзера - из мидлвары авторизации
  req.body.tour = req.body.tour ?? req.params.tourID;
  req.body.user = req.body.user ?? req.user.id;

  const review = await Review.create(req.body);
  res.status(201).json({
    status: 'success',
    data: {
      review,
    },
  });
});
