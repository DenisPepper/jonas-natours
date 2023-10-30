const fs = require('fs');
const express = require('express');
const morgan = require('morgan');
const port = 3000;
const routes = {
  home: '/',
  users: '/api/v1/users',
  //user: '/api/v1/users/:id',
  tours: '/api/v1/tours',
  //tour: '/api/v1/tours/:id/:type?', //:type? - необязательный параметр
};
const toursPath = `${__dirname}/dev-data/data/tours.json`;

const tours = JSON.parse(fs.readFileSync(toursPath));

const app = express();

// --------1 middleware -------------------

app.use(express.json());

// выводит в консоль инфо о запросах/ответах
app.use(morgan('dev'));

// мидлвара, которая добавляет время запроса
app.use((req, res, next) => {
  req.time = Date.now();
  next();
});

// --------2 routes handlers -------------------

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

const getStub = (req, res) => {
  res.status(500).send('server error!');
};

const getAllUsers = (req, res) => {
  return getStub(req, res);
};

const createUser = (req, res) => {
  return getStub(req, res);
};

const getUsersById = (req, res) => {
  return getStub(req, res);
};

const updateUser = (req, res) => {
  return getStub(req, res);
};

const deleteUser = (req, res) => {
  return getStub(req, res);
};

// --------3 routes -------------------
const userRouter = express.Router();
const tourRouter = express.Router();

userRouter.route('/').get(getAllUsers).post(createUser);
userRouter.route('/:id').get(getUsersById).patch(updateUser).delete(deleteUser);

tourRouter.route('/').get(getTours).post(createTour);
tourRouter.route('/:id').get(getTourById).patch(updateTour).delete(deleteTour);
// это middleware будет использовано только для указанного маршрута
app.use(routes.users, userRouter);
app.use(routes.tours, tourRouter);

// --------4 start server -------------------
app.listen(port, () => console.log(`server run on ${port} port ...`));
