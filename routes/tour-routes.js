const fs = require('fs');
const express = require('express');

const router = express.Router();

const toursPath = `${__dirname}/../dev-data/data/tours.json`;

const tours = JSON.parse(fs.readFileSync(toursPath));

const getTours = (req, res) => {
  res.status(200).json({
    status: 'success',
    time: req.time,
    results: tours.length,
    data: {
      tours,
    },
  });
};

const getTourById = (req, res) => {
  const { id, type } = req.params;
  const tour = tours.find((tour) => id === tour._id);

  res.status(200).json({
    status: 'success',
    data: {
      tour,
    },
  });
};

const createTour = (req, res) => {
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

const updateTour = (req, res) => {
  const { id, type } = req.params;
  const tour = tours.find((tour) => id === tour._id);

  if (!tour) return res.status(404).send('Invalid id');

  const newtour = { ...tour, ...req.body };
  // update tour in DB and send it back

  res.status(200).json({
    status: 'success',
    data: {
      tour: newtour,
    },
  });
};

const deleteTour = (req, res) => {
  const { id, type } = req.params;
  const tour = tours.find((tour) => id === tour._id);

  if (!tour) return res.status(404).send('Invalid id');

  // delete tour from DB and send response without payload

  res.status(204);
};

router.route('/').get(getTours).post(createTour);
router.route('/:id').get(getTourById).patch(updateTour).delete(deleteTour);

module.exports = router;
