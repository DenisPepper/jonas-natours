const Tour = require('../models/tour-model');
const APIFeatures = require('../utils/api-features');
const handleAsync = require('../utils/handle-async');

exports.aliasTopTours = (req, res, next) => {
  req.query.limit = 5;
  req.query.sort = '-ratingsAverage,price';
  req.query.fields = 'name,price,ratingsAverage,summary,difficulty';
  next();
};

exports.getTours = async (req, res) => {
  const features = new APIFeatures(Tour.find(), req.query)
    .filter()
    .sort()
    .limitFields()
    .paginate();

  try {
    const toursList = await features.query;
    res.status(200).json({
      status: 'success',
      results: toursList.length,
      data: {
        tours: toursList,
      },
    });
  } catch (error) {
    res.status(404).json({
      status: 'error',
      message: error,
    });
  }
};

exports.getTourById = async (req, res) => {
  const { id } = req.params;
  try {
    const tour = await Tour.findById(id);
    res.status(200).json({
      status: 'success',
      data: {
        tour,
      },
    });
  } catch (error) {
    res.status(404).json({
      status: 'error',
      message: error,
    });
  }
};

exports.createTour = handleAsync(async (req, res, next) => {
  const tour = await Tour.create(req.body);
  res.status(201).json({
    status: 'success',
    data: {
      tour,
    },
  });
});

exports.updateTour = async (req, res) => {
  const { id } = req.params;
  try {
    // new: true - вернет обновленный документ, а не оригинал
    const tour = await Tour.findByIdAndUpdate(id, req.body, {
      new: true,
      runValidators: true, // включет валидацию при обновлении документа
    });
    res.status(200).json({
      status: 'success',
      data: {
        tour,
      },
    });
  } catch (error) {
    res.status(400).json({
      status: 'error',
      message: error,
    });
  }
};

exports.deleteTour = async (req, res) => {
  const { id } = req.params;
  try {
    await Tour.findByIdAndDelete(id);
    res.status(204).send();
  } catch (error) {
    res.status(400).json({
      status: 'error',
      message: error,
    });
  }
};

exports.getTourStats = async (req, res) => {
  try {
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
  } catch (error) {
    res.status(400).json({
      status: 'error',
      message: error,
    });
  }
};

exports.getMonthlyPlan = async (req, res) => {
  const year = Number(req.params.year);
  try {
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
  } catch (error) {
    res.status(400).json({
      status: 'error',
      message: error,
    });
  }
};
// { $unwind: '$startDates' }, startDates - массив,
// $unwind - создаст количество документов, равное числу элементов массива
