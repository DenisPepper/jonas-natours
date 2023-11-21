const Review = require('../models/review-model');
const APIFeatures = require('../utils/api-features');
const handleAsync = require('../utils/handle-async');
const factory = require('./handler-factory');

exports.checkRequestBody = (req, res, next) => {
  // если браузер указал роут вручную,
  // нужно установить тур из строки запроса, а юзера - из мидлвары авторизации
  req.body.tour = req.body.tour ?? req.params.tourID;
  req.body.user = req.body.user ?? req.user.id;
  next();
};

exports.getReviews = handleAsync(async (req, res, next) => {
  const tour = req.params.tourID ? { tour: req.params.tourID } : {};

  const features = new APIFeatures(Review.find(tour), req.query)
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

exports.createReview = factory.createOne(Review);

exports.deleteReview = factory.deleteOneById(Review);

exports.updateReview = factory.updateOneById(Review);
