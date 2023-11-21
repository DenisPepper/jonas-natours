const Review = require('../models/review-model');
const factory = require('./handler-factory');

exports.checkRequestBody = (req, res, next) => {
  // если браузер указал роут вручную,
  // нужно установить тур из строки запроса, а юзера - из мидлвары авторизации
  req.body.tour = req.body.tour ?? req.params.tourID;
  req.body.user = req.body.user ?? req.user.id;
  next();
};

exports.getReviews = factory.getAll(Review);

exports.getReviewById = factory.getOneById(Review);

exports.createReview = factory.createOne(Review);

exports.deleteReview = factory.deleteOneById(Review);

exports.updateReview = factory.updateOneById(Review);
