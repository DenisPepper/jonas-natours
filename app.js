const express = require('express');
const rateLimit = require('express-rate-limit');
const helmet = require('helmet');
const mongoSanitize = require('express-mongo-sanitize');
const xss = require('xss-clean');
const morgan = require('morgan');
const AppError = require('./utils/app-error');
const globalErrorHandler = require('./controllers/error-controller');
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

// --------1 global middlewares -------------------

// установит заголовки, обеспечивающие безопасность
// некоторые включены по умолчанию, некоторые надо включать опционально
// https://github.com/helmetjs/helmet
app.use(helmet());

//обрабатывает body в запросе, считывает даные из тела запроса в req.body
// установит размер данных в body не более 10 кб
app.use(express.json({ limit: '10kb' }));

// очистка входных данных от noSQL инъекций
app.use(mongoSanitize());

// очистка входных данных от XSS
app.use(xss());

// Обрабатывает статические файлы в указанной папке
// http://127.0.0.1:3000/overview.html - откроет в браузере указанный ресурс из папки public
app.use(express.static(`${__dirname}/public`));

if (process.env.NODE_ENV === 'development') {
  // выводит в консоль инфо о запросах/ответах
  app.use(morgan('dev'));
}

// разрешает 100 запросов за 1 час с одного ip-адреса
const limiter = rateLimit({
  max: 100,
  windowMs: 60 * 60 * 1000,
  message: 'Превышено количество запросов для IP-адреса',
});
app.use('/api', limiter);

// мидлвара, которая добавляет время запроса
app.use((req, res, next) => {
  req.time = Date.now();
  next();
});

// это middleware будет использовано только для указанного маршрута
app.use(routes.users, userRouter);
app.use(routes.tours, tourRouter);

//Обработка ошибок, связаных с вводом недействительных url-адресов
// сработает для всех методов
app.all('*', (req, res, next) => {
  // если в next() передать аргумент, то он будет автоматически распознан как ошибка
  next(new AppError(`rout: ${req.url} - not found!`, 404));
});

// если express передать обработчик с 4-мя параметрами, то он автоматически будет вызываться
// как обработчик ошибок
app.use(globalErrorHandler);

module.exports = app;
