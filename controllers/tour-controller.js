const Tour = require('../models/tour-model');
const APIFeatures = require('../utils/api-features');
const handleAsync = require('../utils/handle-async');
const AppError = require('../utils/app-error');
const factory = require('./handler-factory');

exports.aliasTopTours = (req, res, next) => {
  req.query.limit = 5;
  req.query.sort = '-ratingsAverage,price';
  req.query.fields = 'name,price,ratingsAverage,summary,difficulty';
  next();
};

exports.getTours = handleAsync(async (req, res, next) => {
  const features = new APIFeatures(Tour.find(), req.query)
    .filter()
    .sort()
    .limitFields()
    .paginate();

  const toursList = await features.query;
  res.status(200).json({
    status: 'success',
    results: toursList.length,
    data: {
      tours: toursList,
    },
  });
});

exports.getTourById = handleAsync(async (req, res, next) => {
  const { id } = req.params;
  const tour = await Tour.findById(id).populate('reviews');

  if (!tour) {
    next(new AppError(`tour with id{${id}} - not found`, 404));
    return;
  }

  res.status(200).json({
    status: 'success',
    data: {
      tour,
    },
  });
});

exports.createTour = handleAsync(async (req, res, next) => {
  const tour = await Tour.create(req.body);
  res.status(201).json({
    status: 'success',
    data: {
      tour,
    },
  });
});

exports.updateTour = factory.updateOneById(Tour);

exports.deleteTour = factory.deleteOneById(Tour);

exports.getTourStats = handleAsync(async (req, res, next) => {
  const stats = await Tour.aggregate([
    { $match: { ratingsAverage: { $gte: 4.5 } } },
    {
      $group: {
        _id: null,
        avgRating: { $avg: '$ratingsAverage' },
        avgPrice: { $avg: '$price' },
        minPrice: { $min: '$price' },
        maxPrice: { $max: '$price' },
      },
    },
    { $sort: { avgPrice: 1 } },
  ]);
  res.status(200).json({
    status: 'success',
    data: stats,
  });
});

exports.getMonthlyPlan = handleAsync(async (req, res, next) => {
  const year = Number(req.params.year);
  const plan = await Tour.aggregate([
    { $unwind: '$startDates' },
    {
      $match: {
        startDates: {
          $gte: new Date(`${year}-01-01`),
          $lte: new Date(`${year}-12-31`),
        },
      },
    },
    {
      $group: {
        _id: { $month: '$startDates' },
        toursCount: { $sum: 1 },
        tours: { $push: '$name' },
      },
    },
    { $addFields: { month: '$_id' } }, //добавит поле
    { $project: { _id: 0 } }, //удалит поле
    { $sort: { month: 1 } },
    { $limit: 3 },
  ]);
  res.status(200).json({
    status: 'success',
    data: plan,
  });
});
// { $unwind: '$startDates' }, startDates - массив,
// $unwind - создаст количество документов, равное числу элементов массива
