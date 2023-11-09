// прочитает переменные окружения из файцла конфигурации
// этот код может быть в любом файле, но на самой верхней строчке
// тогда process.env переменные из конфигурации будут доступны в любом модуле
require('dotenv').config({ path: './config.env' });

// добавит обработчик для перехвата непойманных исключений
process.on('uncaughtException', (err) => {
  console.log(`uncaught exception: ${err.name}, ${err.message}`);
  process.exit(1);
});

const mongoose = require('mongoose');
const app = require('./app');

mongoose
  .connect(process.env.DATABASE, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
    useUnifiedTopology: true,
  })
  .then(() => console.log('DB connection success...'));

const port = process.env.PORT;

const server = app.listen(port, () =>
  console.log(`server run on http://127.0.0.1:${port} ...`),
);

// добавит обработчик для перехвата отклоненных промисов,
// например при неудачном подключении к DB
process.on('unhandledRejection', (err) => {
  console.log(`unhandled rejection: ${err.name}, ${err.message}`);
  //останавливаем сервер, завершаяя все полученные запросы и останавливаем выполнение программы с кодом 1
  server.close(() => process.exit(1));
});
