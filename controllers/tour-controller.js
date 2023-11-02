const Tour = require('../models/tour-model');

exports.checkBodyProps = (req, res, next) => {
  const { name, price } = req.body;

  if (!name || !price) return res.status(400).send('Invalid name or price');

  next();
};

exports.getTours = (req, res) => {
  res.status(200).json({
    status: 'success',
    time: req.time,
    results: tours.length,
    data: {
      tours,
    },
  });
};

exports.getTourById = (req, res) => {
  const { id, type } = req.params;
  const tour = tours.find((item) => id === item._id);

  res.status(200).json({
    status: 'success',
    data: {
      tour,
    },
  });
};

exports.createTour = (req, res) => {
  const id = tours[tours.length - 1].id + 1;
  const tour = { ...req.body, id };
  tours.push(tour);

  fs.writeFile(toursPath, JSON.stringify(tours), (err) => {
    res.status(201).json({
      status: 'success',
      data: {
        tour,
      },
    });
  });
};

exports.updateTour = (req, res) => {
  const { id, type } = req.params;
  const tour = tours.find((item) => id === item._id);

  const newtour = { ...tour, ...req.body };
  // update tour in DB and send it back

  res.status(200).json({
    status: 'success',
    data: {
      tour: newtour,
    },
  });
};

exports.deleteTour = (req, res) => {
  //const { id, type } = req.params;
  //const tour = tours.find((item) => id === item._id);
  // delete tour from DB and send response without payload
  res.status(204);
};

/* 
exports.checkId = (req, res, next, val) => {
  const id = val;
  const tour = tours.find((item) => id === item._id);
  if (!tour) return res.status(404).send('Invalid id');
  next();
};
 */
