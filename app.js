const fs = require('fs');
const express = require('express');
const port = 3000;
const routes = {
  home: '/',
  tours: '/api/v1/tours',
  tour: '/api/v1/tours/:id/:type?', //:type? - необязательный параметр
};
const toursPath = `${__dirname}/dev-data/data/tours.json`;

const tours = JSON.parse(fs.readFileSync(toursPath));

const app = express();
app.use(express.json());

// пользовательское middleware
app.use((req, res, next) => {
  console.log('custom middleware');
  next();
});

const getTours = (req, res) => {
  res.status(200).json({
    status: 'success',
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

app.route(routes.tours).get(getTours).post(createTour);

app.route(routes.tour).get(getTourById).patch(updateTour).delete(deleteTour);

/* 
app.get(routes.home, (req, res) => {
  res.status(200).json({ message: 'welcome to home page', app: 'Natours app' });
});

app.post(routes.home, (req, res) => {
  res.status(404).send('Stop doing this...');
});
 */
app.listen(port, () => console.log(`server run on ${port} port ...`));
