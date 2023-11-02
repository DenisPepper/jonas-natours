const Tour = require('../models/tour-model');

const tours = [];

exports.getTours = async (req, res) => {
  try {
    const toursList = await Tour.find();
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

exports.createTour = async (req, res) => {
  try {
    const tour = await Tour.create(req.body);
    res.status(201).json({
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

exports.updateTour = (req, res) => {};

exports.deleteTour = (req, res) => {};

/* 
exports.checkId = (req, res, next, val) => {
  const id = val;
  const tour = tours.find((item) => id === item._id);
  if (!tour) return res.status(404).send('Invalid id');
  next();
};
 */

/* exports.checkBodyProps = (req, res, next) => {
  const { name, price } = req.body;

  if (!name || !price) return res.status(400).send('Invalid name or price');

  next();
}; */
