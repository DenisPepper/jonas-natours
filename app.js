const tourRouter = require('./routes/tour-routes');
const userRouter = require('./routes/user-routes');
const express = require('express');
const morgan = require('morgan');

const routes = {
  home: '/',
  users: '/api/v1/users',
  //user: '/api/v1/users/:id',
  tours: '/api/v1/tours',
  //tour: '/api/v1/tours/:id/:type?', //:type? - необязательный параметр
};

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

// это middleware будет использовано только для указанного маршрута
app.use(routes.users, userRouter);
app.use(routes.tours, tourRouter);

module.exports = app;
