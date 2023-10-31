// прочитает переменные окружения из файцла конфигурации
// этот код может быть в любом файле, но на самой верхней строчке
// тогда process.env переменные из конфигурации будут доступны в любом модуле
require('dotenv').config({ path: './config.env' });

const app = require('./app');
const port = process.env.PORT;

app.listen(port, () =>
  console.log(`server run on http://127.0.0.1:${port} ...`)
);

/* // переменные окружения node
console.log(process.env);

// переменные окружения express
console.log(app.get('env'));
 */
