const express = require('express');
const morgan = require('morgan');
const tourRouter = require('./routes/tour-routes');
const userRouter = require('./routes/user-routes');

const routes = {
  home: '/',
  users: '/api/v1/users',
  //user: '/api/v1/users/:id',
  tours: '/api/v1/tours',
  //tour: '/api/v1/tours/:id/:type?', //:type? - необязательный параметр
};

const app = express();

// --------1 middleware -------------------

//обрабатывает body в запросе, предоставляя body в формате json
app.use(express.json());

// Обрабатывает статические файлы в указанной папке
// http://127.0.0.1:3000/overview.html - откроет в браузере указанный ресурс из папки public
app.use(express.static(`${__dirname}/public`));

if (process.env.NODE_ENV === 'development') {
  // выводит в консоль инфо о запросах/ответах
  app.use(morgan('dev'));
}

// мидлвара, которая добавляет время запроса
app.use((req, res, next) => {
  req.time = Date.now();
  next();
});

// это middleware будет использовано только для указанного маршрута
app.use(routes.users, userRouter);
app.use(routes.tours, tourRouter);

module.exports = app;
