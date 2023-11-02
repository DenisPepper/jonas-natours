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

const tourSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Tour must have a name'],
    unique: true,
  },
  rating: { type: Number, default: 4.5 },
  price: { type: Number, required: [true, 'Tour must have a price'] },
});

const Tour = mongoose.model('Tour', tourSchema);
const testTour = new Tour({
  name: 'The Forest Hiker',
  rating: 4.7,
  price: 490,
});
testTour
  .save()
  .then((doc) => console.log('save OK ⭐'))
  .catch((err) => console.log('error at save 🐸'));

const port = process.env.PORT;

app.listen(port, () =>
  console.log(`server run on http://127.0.0.1:${port} ...`),
);

/* // переменные окружения node
console.log(process.env);

// переменные окружения express
console.log(app.get('env'));
 */
