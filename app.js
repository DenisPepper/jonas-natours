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

app.get(routes.tours, (req, res) => {
  res.status(200).json({
    status: 'success',
    results: tours.length,
    data: {
      tours,
    },
  });
});

app.get(routes.tour, (req, res) => {
  const { id, type } = req.params;
  const tour = tours.find((tour) => id === tour._id);

  res.status(200).json({
    status: 'success',
    data: {
      tour,
    },
  });
});

app.post(routes.tours, (req, res) => {
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
});

/* 
app.get(routes.home, (req, res) => {
  res.status(200).json({ message: 'welcome to home page', app: 'Natours app' });
});

app.post(routes.home, (req, res) => {
  res.status(404).send('Stop doing this...');
});
 */
app.listen(port, () => console.log(`server run on ${port} port ...`));
