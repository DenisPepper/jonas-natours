// прочитает переменные окружения из файцла конфигурации
// этот код может быть в любом файле, но на самой верхней строчке
// тогда process.env переменные из конфигурации будут доступны в любом модуле
require('dotenv').config({ path: './config.env' });

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

app.listen(port, () =>
  console.log(`server run on http://127.0.0.1:${port} ...`),
);

/* // переменные окружения node
console.log(process.env);

// переменные окружения express
console.log(app.get('env'));
 */
