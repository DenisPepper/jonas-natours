const app = require('./app');

const port = 3000;

app.listen(port, () => console.log(`server run on ${port} port ...`));

// переменные окружения node
console.log(process.env);

// переменные окружения express
console.log(app.get('env'))