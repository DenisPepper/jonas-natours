const path = require('path');
const express = require('express');
const rateLimit = require('express-rate-limit');
const helmet = require('helmet');
const mongoSanitize = require('express-mongo-sanitize');
const xss = require('xss-clean');
const hpp = require('hpp');
const morgan = require('morgan');
const cookieParser = require('cookie-parser');
const AppError = require('./utils/app-error');
const globalErrorHandler = require('./controllers/error-controller');
const viewRouter = require('./routes/view-routes');
const tourRouter = require('./routes/tour-routes');
const userRouter = require('./routes/user-routes');
const reviewRouter = require('./routes/review-router');

const routes = {
  home: '/',
  users: '/api/v1/users',
  tours: '/api/v1/tours',
  reviews: '/api/v1/reviews',
};

const app = express();

// установит pug в качестве шаблонизатора
app.set('view engine', 'pug');
// укажет путь до вьюшек
app.set('views', path.join(__dirname, 'views'));

// --------1 global middlewares -------------------

// Обрабатывает статические файлы в указанной папке
// будет отдавать на клиент при запросах картинки из папки img, стили из папки css
// http://127.0.0.1:3000/overview.html - откроет в браузере указанный ресурс из папки public
app.use(express.static(path.join(__dirname, 'public')));

// установит заголовки, обеспечивающие безопасность
// некоторые включены по умолчанию, некоторые надо включать опционально
// https://github.com/helmetjs/helmet
app.use(helmet());

//обрабатывает body в запросе, считывает даные из тела запроса в req.body
// установит размер данных в body не более 10 кб
app.use(express.json({ limit: '10kb' }));

// установит парсер данных формы, когда форма отправляется нативно браузером с перезагрузкой страницы
// поместит данные в req.body
app.use(express.urlencoded({ extended: true, limit: '10kb' }));

// читает куки из запросов
app.use(cookieParser());

// очистка входных данных от noSQL инъекций
app.use(mongoSanitize());

// очистка входных данных от XSS
app.use(xss());

// очистка строки с параметрами запроса от дублирований, повторений и т.п.
// в белый список можно передавать имена параметров в качестве исключений
app.use(
  hpp({
    whitelist: [
      'duration',
      'ratingsAverage',
      'ratingsQuantity',
      'maxGroupSize',
      'difficulty',
      'price',
    ],
  }),
);

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
  console.log(req.cookies);
  next();
});

// это middleware будет использовано только для указанного маршрута
app.use(routes.home, viewRouter);
app.use(routes.users, userRouter);
app.use(routes.tours, tourRouter);
app.use(routes.reviews, reviewRouter);

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
